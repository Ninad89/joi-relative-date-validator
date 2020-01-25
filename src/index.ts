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
            'relateiveDate.before': 'date must be before {{#value}} {{#unit}} from {{#from}}',
            'relateiveDate.after': 'date must be after {{#value}} {{#unit}} from {{#from}}',
        },
        rules: {
            before: {
                alias: 'lessThan',
                method(value, unit) {
                    return this.$_addRule({ name: 'before', args: { value, unit } });
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
                    const mustBeBefore = getRelativeToDate().add(args.value, args.unit);
                    const toValidate = moment(value);
                    if (!toValidate.isBefore(mustBeBefore)) {
                        return helpers.error('relateiveDate.before', {
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
                    const mustBeAfterThan = getRelativeToDate().add(args.days, 'days');
                    const toValidate = moment(value);
                    if (!toValidate.isAfter(mustBeAfterThan)) {
                        return helpers.error('relateiveDate.before', {
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
            return moment(relativeTo);
        }
    }

    function isValidUnit(unit: string): boolean {
        return VALID_MOMENT_UNIT.includes(unit);
    }
}

const custom = Joi.extend(relativeDateValidator());

const schema = Joi.object({
    dueDate: custom.relativeDate().before(2, 'y'),
});
const x = schema.validate({ dueDate: '2018-01-01' });

// console.log(x);
