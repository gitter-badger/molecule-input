/** @jsx hJSX */

import cuid from 'cuid';
import assign from 'fast.js/object/assign';
import intent from './intent';
import model from './model';
import view from './view';
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom'; // eslint-disable-line
import {Input} from './../src';
import {Textarea} from './../src';
import SsnInput from './SsnInput/index';

const DIALOGUE_NAME = `page-Demo`;

function demo({DOM}) {
  const id = cuid();
  const actions = intent({DOM, id, dialogueName: DIALOGUE_NAME});
  const state$ = model({actions, dialogueName: DIALOGUE_NAME});
  const vtree$s = [

    /* TEXT INPUT */

    Input({
      DOM, props$: Rx.Observable.just({
        label: `label`,
      }),
    }).DOM,
    Input({
      DOM, props$: Rx.Observable.just({
        label: `password`, type: `password`,
      }),
    }).DOM,
    Input({
      DOM, props$: Rx.Observable.just({
        label: `label (disableLabelFloat)`, disableLabelFloat: true,
      }),
    }).DOM,
    Input({
      DOM, props$: Rx.Observable.just({
        label: `disabled`, isDisabled: true,
      }),
    }).DOM,
    Input({
      DOM, props$: Rx.Observable.just({
        label: `initial value`, value: `some text...`,
      }),
    }).DOM,

    /* TEXTAREA */

    Textarea({
      DOM, props$: Rx.Observable.just({
        label: `textarea label`,
      }),
    }).DOM,
    Textarea({
      DOM, props$: Rx.Observable.just({
        label: `textarea with initial value`,
        value: `Hi,\r\n
        \r\n
        I am filled with some random text.\r\n
        \r\n
        Regards,\r\n
        The author`,
      }),
    }).DOM,
    Textarea({
      DOM, props$: Rx.Observable.just({
        label: `textarea with rows and maxRows`,
        rows: 3,
        maxRows: 4,
      }),
    }).DOM,

    /* VALIDATION */

    Input({
      DOM, props$: Rx.Observable.just({
        label: `input validates on blur (required, autoValidate)`,
        required: true,
        autoValidate: true,
        errorMessage: `needs some text!`,
      }),
    }).DOM,
    Input({
      DOM, props$: Rx.Observable.just({
        label: `only type letters (autoValidate)`,
        autoValidate: true,
        pattern: `[a-zA-Z]*`,
        errorMessage: `letters only!`,
      }),
    }).DOM,
    Input({
      DOM, props$: actions.validate$.map(
        (validate) => ({
          label: `only type letters (required, no autoValidate)`,
          required: true,
          pattern: `[a-zA-Z]*`,
          errorMessage: `letters only, required input!`,
          validate,
        })
      ),
    }).DOM,
    Input({
      DOM, props$: Rx.Observable.just({
        label: `password only letters, numbers and underscore`,
        type: `password`,
        required: true,
        pattern: `^[a-zA-Z][a-zA-Z0-9_]{3,14}$`,
        autoValidate: true,
        maxLength: 15,
        errorMessage: `Must start with a letter. Min. 4 chars. Max. 15 chars.`,
      }),
    }).DOM,

    /* CHARACTER COUNTER */

    Input({
      DOM, props$: Rx.Observable.just({
        label: `label`, charCounter: true,
      }),
    }).DOM,
    Input({
      DOM, props$: Rx.Observable.just({
        label: `at most 10 letters`,
        charCounter: true,
        autoValidate: true,
        pattern: `[a-zA-Z]*`,
        maxLength: 10,
        errorMessage: `letters only!`,
      }),
    }).DOM,
    Textarea({
      DOM, props$: Rx.Observable.just({
        label: `textarea`, charCounter: true,
      }),
    }).DOM,

    /* PREFIXES AND SUFFIXES */

    Input({
      DOM, props$: Rx.Observable.just({
        label: `total`, type: `number`, prefix: `$`, className: `short`,
      }),
    }).DOM,
    Input({
      DOM, props$: Rx.Observable.just({
        label: `username`, suffix: `@email.com`, className: `short`,
      }),
    }).DOM,

    /* COMPLEX INPUTS */

    SsnInput({
      DOM, props$: Rx.Observable.just({
        label: `Social Security Number`,
        errorMessage: `Invalid SSN!`,
        autoValidate: true,
        className: `short`,
      }),
    }).DOM,

  ];

  return {
    DOM: view({state$, id}, ...vtree$s),
    id,
    state$: state$.map((state) => assign({}, state)),
  };
}

export default demo;
