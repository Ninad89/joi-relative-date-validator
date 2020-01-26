import Joi from '@hapi/joi';
import { Extension, RuleArgs } from '@hapi/joi';
import moment from 'moment';

const VALID_MOMENT_UNIT = [
    'year',
    'years',
    'y',
    'quarter',
    'quarters',
    'Q',
    'month',
    'months',
    'M',
    'week',
    'weeks',
    'w',
    'day',
    'days',
    'd',
    'hour',
    'hours',
    'h',
    'minute',
    'minutes',
    'm',
    'millisecond',
    'milliseconds',
    'ms',
];

export default function relativeDateValidator(relativeTo: Date | string = 'today'): Extension {
    if (relativeTo !== 'today') {
        if (!moment(relativeTo).isValid()) {
            throw new Error('Argument passed must be valid date');
        }
    }
    return {
        type: 'relativeDate',
        base: Joi.date(),
        messages: {
            'relateiveDate.within': 'date must be within {{#value}} {{#unit}} from {{#from}}',
            'relateiveDate.after': 'date must be after {{#value}} {{#unit}} from {{#from}}',
        },
        rules: {
            within: {
                method(value, unit) {
                    return this.$_addRule({ name: 'within', args: { value, unit } });
                },
                args: [
                    {
                        name: 'value',
                        ref: true,
                        assert: (value) => typeof value === 'number' && !isNaN(value),
                        message: 'must be a number',
                    },
                    {
                        name: 'unit',
                        assert: (unit) => isValidUnit(unit),
                        message: 'must be a valid date unit',
                    },
                ],
                validate(value, helpers, args, options) {
                    const mustBeBeforeThan = getRelativeToDate().add(args.value, args.unit);
                    const toValidate = moment(value);
                    if (!toValidate.isBefore(mustBeBeforeThan)) {
                        return helpers.error('relateiveDate.within', {
                            value: args.value,
                            unit: moment.normalizeUnits(args.unit),
                            from: getRelativeToDate().format('DD-MM-YYYY'),
                        });
                    }
                },
            },
            after: {
                alias: 'greaterThan',
                method(value, unit) {
                    return this.$_addRule({ name: 'after', args: { value, unit } });
                },
                args: [
                    {
                        name: 'value',
                        ref: true,
                        assert: (value) => typeof value === 'number' && !isNaN(value),
                        message: 'must be a number',
                    },
                    {
                        name: 'unit',
                        assert: (unit) => isValidUnit(unit),
                        message: 'must be a valid date unit',
                    },
                ],
                validate(value, helpers, args, options) {
                    const mustBeAfterThan = getRelativeToDate().add(args.value, args.unit);
                    const toValidate = moment(value);

                    if (!toValidate.isAfter(mustBeAfterThan)) {
                        return helpers.error('relateiveDate.after', {
                            days: args.days,
                            from: getRelativeToDate().format('DD-MM-YYYY'),
                        });
                    }
                },
            },
        },
    };

    function getRelativeToDate() {
        if (relativeTo === 'today') {
            return moment();
        } else {
            const dt = moment(relativeTo);
            return dt;
        }
    }

    function isValidUnit(unit: string): boolean {
        return VALID_MOMENT_UNIT.includes(unit);
    }
}
