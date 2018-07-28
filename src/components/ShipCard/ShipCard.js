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
import s from './ShipCard.less';

import Link from '../Link';
import { getLanguage } from '../../i18n/Language';
import TranslatedComponent from '../TranslatedComponent';

const SizeMap = ['', 'small', 'medium', 'large', 'capital'];

const UiButton = props => {
  const classes = props.isClicked ? s['ui-button clicked'] : s['ui-button'];
  const number = props.isClicked ? props.number + 1 : props.number;

  return (
    <button className={classes} id={props.text} onClick={() => props.onClick()}>
      <span className={s['ui-icon']}>{props.icon} </span>
      {number}
    </button>
  );
};

class ButtonBox extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.likeIsClicked);
    this.state = {
      likeIsClicked: props.likeIsClicked,
      repostIsClicked: props.repostIsClicked
    };
  }

  toggle(index) {
    const state = {};
    state[index] = !this.state[index];
    this.setState(state);
  }

  render() {
    return (
      <div>
        <UiButton icon="✎" text="comment" number={2} isClicked={false} />
        <UiButton
          icon="♥"
          text="likes"
          number={this.props.likes}
          onClick={() => this.toggle('likeIsClicked')}
          isClicked={this.state.likeIsClicked}
        />
        <UiButton
          icon="➥"
          text="repost"
          number={this.props.reposts}
          onClick={() => this.toggle('repostIsClicked')}
          isClicked={this.state.repostIsClicked}
        />
      </div>
    );
  }
}

const UiCard = props => {
  const { image, tag, title, content, author } = props.content;
  return (
    <div className={s['ui-card']}>
      <div className={s['ui-card-img']}>
        <img src={image} />
      </div>
      <div className={s['ui-card-content']}>
        <h5>{tag}</h5>
        <Link className={s.noDec} to={`/build/${props.content.shortid}`}>
          <h3>{title}</h3>
        </Link>
        <p>{content}</p>
        <p>- {author.username}</p>
      </div>
    </div>
  );
};

export class SocialCard extends React.Component {
  render() {
    return (
      <div className={s['social-card']}>
        <UiCard content={this.props.content} />
        <div className={s.line} />
        <div style={{ textAlign: 'right' }}>
          <ButtonBox
            likeIsClicked={this.props.likeIsClicked}
            repostIsClicked={this.props.repostIsClicked}
            likes={this.props.likes}
            reposts={this.props.reposts}
          />
        </div>
      </div>
    );
  }
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

class ShipCard extends TranslatedComponent {
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
        <td className="ri">{ship.description}</td>
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

    return <div className={s.page} style={{ fontSize: `${sizeRatio}em` }} />;
  }
}

export default withStyles(s)(SocialCard);
