/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tooltip from '../../components/Tooltip';
import s from './ShipTable.less';

import Link from '../Link';
import { getLanguage } from '../../i18n/Language';
import TranslatedComponent from '../TranslatedComponent';

const SizeMap = ['', 'small', 'medium', 'large', 'capital'];

function countHp(slot) {
  this.hp[slot.maxClass]++;
  this.hpCount++;
}

function countInt(slot) {
  this.int[slot.maxClass - 1]++; // Subtract 1 since there is no Class 0 Internal compartment
  this.intCount++;
  this.maxPassengers += slot.passengers ? slot.passengers : 0;
}

function shipSummary(shipId, shipData, ship) {
  const summary = ship.coriolisShip;
  for (const i in ship) {
    if (i === 'coriolisShip') {
      continue;
    }
    summary[i] = ship[i];
  }
  Object.assign(summary, ship.coriolisShip);
  // summary = {
  //   id: shipId,
  //   hpCount: 0,
  //   intCount: 0,
  //   maxCargo: 0,
  //   maxPassengers: 0,
  //   hp: [0, 0, 0, 0, 0], // Utility, Small, Medium, Large, Huge
  //   int: [0, 0, 0, 0, 0, 0, 0, 0], // Sizes 1 - 8
  //   standard: shipData.standard
  // };
  summary.hp = [0, 0, 0, 0, 0];
  summary.maxPassengers = 0;
  summary.cost = 0;
  summary.int = [0, 0, 0, 0, 0, 0, 0, 0];
  for (const i of summary.costList) {
    summary.cost += i.discountedCost;
  }
  // Build Ship
  ship.internal = ship.coriolisShip.internal;
  ship.internal.forEach(countInt.bind(summary));
  ship.hardpoints = ship.coriolisShip.hardpoints;
  summary.hardpoints.forEach(countHp.bind(summary)); // Count Hardpoints by class
  summary.retailCost = ship.totalCost; // Record Stock/Default/retail cost
  summary.maxJumpRange = ship.unladenRange; // Record Jump Range
  summary.standard = ship.coriolisShip.standard;
  summary.baseArmour = ship.armour;

  return summary;
}

class ShipTable extends TranslatedComponent {
  static propTypes = {
    shipRows: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
    const detailRows = [];
    this.tooltip = this.tooltip.bind(this);
    this._termtip = this._termtip.bind(this);
    this.language = getLanguage('en');
    this.translate = this.language.translate.bind(this);

    this.formats = this.language.formats;
    this.units = this.language.units;
    for (const i in props.shipRows) {
      detailRows.push(shipSummary(i, props.shipRows[i], props.shipRows[i]));
    }
    this.state = {
      detailRows
    };
  }

  tooltip(content, rect, opts) {
    return;
    if (!content && this.state.tooltip) {
      this.setState({ tooltip: null });
    } else if (content) {
      this.setState({
        tooltip: (
          <Tooltip rect={rect} options={opts}>
            {content}
          </Tooltip>
        )
      });
    }
  }

  _termtip(term, opts, event, e2) {
    return;
    if (opts && opts.nativeEvent) {
      // Opts is the SyntheticEvent
      event = opts;
      opts = { cap: true };
    }
    if (e2 instanceof Object && e2.nativeEvent) {
      // E2 is the SyntheticEvent
      event = e2;
    }

    this.tooltip(
      <div className={`cen${opts.cap ? ' cap' : ''}`}>
        {this.translate(term)}
      </div>,
      event.currentTarget.getBoundingClientRect(),
      opts
    );
  }

  _shipRowElement(ship, translate, u, fInt, fRound, highlight) {
    if (!ship) {
      return;
    }
    if (!ship.standard) {
      return;
    }
    return (
      <tr
        key={ship.id}
        style={{ height: '4.5em' }}
        className={cx({
          alt: highlight
        })}
      >
        <td className="ri">{ship.manufacturer}</td>
        <td className="ri">{fInt(ship.cost)}</td>
        <td className="ri cap">{translate(SizeMap[ship.class])}</td>
        <td className="ri">{fInt(ship.crew)}</td>
        <td className="ri">{ship.masslock}</td>
        <td className="ri">{fInt(ship.hardness)}</td>
        <td className="ri">{fInt(ship.hullMass)}</td>
        <td className="ri">{fInt(ship.speed)}</td>
        <td className="ri">{fInt(ship.boost)}</td>
        <td className="ri">{fInt(ship.armour)}</td>
        <td className="ri">{fInt(ship.shield)}</td>
        <td className="ri">{fInt(ship.topSpeed)}</td>
        <td className="ri">{fInt(ship.topBoost)}</td>
        <td className="ri">{fRound(ship.unladenRange)}</td>
        <td className="ri">{fInt(ship.cargoCapacity)}</td>
        <td className="ri">{fInt(ship.maxPassengers)}</td>
        <td className={cx({ disabled: !ship.hp[1] })}>{ship.hp[1]}</td>
        <td className={cx({ disabled: !ship.hp[2] })}>{ship.hp[2]}</td>
        <td className={cx({ disabled: !ship.hp[3] })}>{ship.hp[3]}</td>
        <td className={cx({ disabled: !ship.hp[4] })}>{ship.hp[4]}</td>
        <td className={cx({ disabled: !ship.hp[0] })}>{ship.hp[0]}</td>
        <td className={cx({ disabled: !ship.int[0] })}>{ship.int[0]}</td>
        <td className={cx({ disabled: !ship.int[1] })}>{ship.int[1]}</td>
        <td className={cx({ disabled: !ship.int[2] })}>{ship.int[2]}</td>
        <td className={cx({ disabled: !ship.int[3] })}>{ship.int[3]}</td>
        <td className={cx({ disabled: !ship.int[4] })}>{ship.int[4]}</td>
        <td className={cx({ disabled: !ship.int[5] })}>{ship.int[5]}</td>
        <td className={cx({ disabled: !ship.int[6] })}>{ship.int[6]}</td>
        <td className={cx({ disabled: !ship.int[7] })}>{ship.int[7]}</td>
      </tr>
    );
  }

  highlightShip(shipId, event) {
    event.stopPropagation();
    this.setState({ shipId });
  }

  sortShips(shipPredicate, shipPredicateIndex) {
    let shipDesc = this.state.shipDesc;

    if (typeof shipPredicateIndex === 'object') {
      shipPredicateIndex = undefined;
    }

    if (
      this.state.shipPredicate === shipPredicate &&
      this.state.shipPredicateIndex === shipPredicateIndex
    ) {
      shipDesc = !shipDesc;
    }

    this.setState({ shipPredicate, shipDesc, shipPredicateIndex });
  }

  render() {
    const { detailRows } = this.state;
    const shipRows = [];
    let shipSummaries = this.state.detailRows;
    const hide = this.tooltip.bind(null, null);
    const sizeRatio = 1;
    let backgroundHighlight = false;
    const { shipPredicate, shipPredicateIndex } = this.state;

    const sortShips = (predicate, index) => {
      return;
      return this.sortShips.bind(this, predicate, index);
    };

    const filters = {};
    shipSummaries = shipSummaries.filter(s => {
      for (const prop in filters) {
        if (!(s[prop] in filters[prop])) {
          return false;
        }
      }
      return true;
    });

    // Sort shipsOverview
    shipSummaries.sort((a, b) => {
      let valA = a[shipPredicate],
        valB = b[shipPredicate];

      if (
        shipPredicateIndex !==
        undefined /* && (valA !== undefined && valB !== undefined) */
      ) {
        valA = valA[shipPredicateIndex];
        valB = valB[shipPredicateIndex];
      }

      if (!this.state.shipDesc) {
        const val = valA;
        valA = valB;
        valB = val;
      }

      if (valA == valB) {
        if (a.name > b.name) {
          return 1;
        }
        return -1;
      } else if (valA > valB) {
        return 1;
      }
      return -1;
    });

    let i = 0;
    const { units, formats, translate } = this;
    for (const shipSummary of shipSummaries) {
      backgroundHighlight = !backgroundHighlight;
      detailRows[i] = this._shipRowElement(
        shipSummary,
        this.language.translate,
        units,
        formats.int,
        formats.round,
        backgroundHighlight
      );
      shipRows[i] = (
        <tr
          key={i}
          style={{ height: '4.5em' }}
          className={cx({
            highlighted: this.state.shipId === s.coriolisId,
            alt: backgroundHighlight
          })}
        >
          <td className={s.le}>
            <Link to={`/build/${shipSummary ? shipSummary.shortid : ''}`}>
              <p>{shipSummary ? shipSummary.name : ''}</p>
            </Link>
          </td>
        </tr>
      );
      i++;
    }

    return (
      <div className={s.page} style={{ fontSize: `${sizeRatio}em` }}>
        {this.state.tooltip}
        <div className="page" style={{ fontSize: `${sizeRatio}em` }}>
          <div
            style={{
              whiteSpace: 'nowrap',
              margin: '0 auto',
              fontSize: '0.8em',
              position: 'relative',
              display: 'inline-block',
              maxWidth: '100%'
            }}
          >
            <table style={{ width: '12em', position: 'absolute', zIndex: 1 }}>
              <thead>
                <tr>
                  <th className="le rgt">&nbsp;</th>
                </tr>
                <tr className="main">
                  <th className="sortable le rgt" onClick={sortShips('name')}>
                    {translate('ship')}
                  </th>
                </tr>
                <tr>
                  <th className="le rgt invisible">&nbsp;</th>
                </tr>
              </thead>
              <tbody>{shipRows}</tbody>
            </table>
            <div style={{ overflowX: 'scroll', maxWidth: '100%' }}>
              <table style={{ marginLeft: 'calc(12em - 1px)', zIndex: 0 }}>
                <thead>
                  <tr className="main">
                    <th
                      rowSpan={3}
                      className="sortable"
                      onClick={sortShips('manufacturer')}
                    >
                      {translate('manufacturer')}
                    </th>
                    <th>&nbsp;</th>
                    <th
                      rowSpan={3}
                      className="sortable"
                      onClick={sortShips('class')}
                    >
                      {translate('size')}
                    </th>
                    <th
                      rowSpan={3}
                      className="sortable"
                      onClick={sortShips('crew')}
                    >
                      {translate('crew')}
                    </th>
                    <th
                      rowSpan={3}
                      className="sortable"
                      onMouseEnter={this._termtip.bind(
                        null,
                        'mass lock factor'
                      )}
                      onMouseLeave={hide}
                      onClick={sortShips('masslock')}
                    >
                      {translate('MLF')}
                    </th>
                    <th
                      rowSpan={3}
                      className="sortable"
                      onMouseEnter={this._termtip.bind(null, 'hardness')}
                      onMouseLeave={hide}
                      onClick={sortShips('hardness')}
                    >
                      {translate('hrd')}
                    </th>
                    <th>&nbsp;</th>
                    <th colSpan={4}>{}</th>
                    <th colSpan={5}>{}</th>
                    <th className="lft" colSpan={7} />
                    <th className="lft" colSpan={5} />
                    <th className="lft" colSpan={8} />
                  </tr>
                  <tr>
                    <th
                      className="sortable lft"
                      onClick={sortShips('retailCost')}
                    >
                      {translate('cost')}
                    </th>
                    <th
                      className="sortable lft"
                      onClick={sortShips('hullMass')}
                    >
                      {translate('hull')}
                    </th>
                    <th className="sortable lft" onClick={sortShips('speed')}>
                      {translate('speed')}
                    </th>
                    <th className="sortable" onClick={sortShips('boost')}>
                      {translate('boost')}
                    </th>
                    <th className="sortable" onClick={sortShips('baseArmour')}>
                      {translate('armour')}
                    </th>
                    <th
                      className="sortable"
                      onClick={sortShips('baseShieldStrength')}
                    >
                      {translate('shields')}
                    </th>

                    <th
                      className="sortable lft"
                      onClick={sortShips('topSpeed')}
                    >
                      {translate('speed')}
                    </th>
                    <th className="sortable" onClick={sortShips('topBoost')}>
                      {translate('boost')}
                    </th>
                    <th
                      className="sortable"
                      onClick={sortShips('maxJumpRange')}
                    >
                      {translate('jump')}
                    </th>
                    <th className="sortable" onClick={sortShips('maxCargo')}>
                      {translate('cargo')}
                    </th>
                    <th
                      className="sortable"
                      onClick={sortShips('maxPassengers')}
                    >
                      {translate('pax')}
                    </th>
                    <th
                      colSpan={5}
                      className="sortable lft"
                      onClick={sortShips('hpCount')}
                    >
                      {translate('hardpoints')}
                    </th>
                    <th
                      colSpan={8}
                      className="sortable lft"
                      onClick={sortShips('intCount')}
                    >
                      {translate('internal compartments')}
                    </th>
                  </tr>
                  <tr>
                    <th
                      className="sortable lft"
                      onClick={sortShips('retailCost')}
                    >
                      {units.CR}
                    </th>
                    <th
                      className="sortable lft"
                      onClick={sortShips('hullMass')}
                    >
                      {units.T}
                    </th>
                    <th className="sortable lft" onClick={sortShips('speed')}>
                      {units['m/s']}
                    </th>
                    <th className="sortable" onClick={sortShips('boost')}>
                      {units['m/s']}
                    </th>
                    <th>&nbsp;</th>
                    <th
                      className="sortable"
                      onClick={sortShips('baseShieldStrength')}
                    >
                      {units.MJ}
                    </th>
                    <th
                      className="sortable lft"
                      onClick={sortShips('topSpeed')}
                    >
                      {units['m/s']}
                    </th>
                    <th className="sortable" onClick={sortShips('topBoost')}>
                      {units['m/s']}
                    </th>
                    <th
                      className="sortable"
                      onClick={sortShips('maxJumpRange')}
                    >
                      {units.LY}
                    </th>
                    <th className="sortable" onClick={sortShips('maxCargo')}>
                      {units.T}
                    </th>
                    <th>&nbsp;</th>
                    <th className="sortable lft" onClick={sortShips('hp', 1)}>
                      {translate('S')}
                    </th>
                    <th className="sortable" onClick={sortShips('hp', 2)}>
                      {translate('M')}
                    </th>
                    <th className="sortable" onClick={sortShips('hp', 3)}>
                      {translate('L')}
                    </th>
                    <th className="sortable" onClick={sortShips('hp', 4)}>
                      {translate('H')}
                    </th>
                    <th className="sortable" onClick={sortShips('hp', 0)}>
                      {translate('U')}
                    </th>

                    <th className="sortable lft" onClick={sortShips('int', 0)}>
                      1
                    </th>
                    <th className="sortable" onClick={sortShips('int', 1)}>
                      2
                    </th>
                    <th className="sortable" onClick={sortShips('int', 2)}>
                      3
                    </th>
                    <th className="sortable" onClick={sortShips('int', 3)}>
                      4
                    </th>
                    <th className="sortable" onClick={sortShips('int', 4)}>
                      5
                    </th>
                    <th className="sortable" onClick={sortShips('int', 5)}>
                      6
                    </th>
                    <th className="sortable" onClick={sortShips('int', 6)}>
                      7
                    </th>
                    <th className="sortable" onClick={sortShips('int', 7)}>
                      8
                    </th>
                  </tr>
                </thead>
                <tbody>{detailRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(ShipTable);
