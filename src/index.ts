import Joi from '@hapi/joi';
import { Extension, RuleArgs } from '@hapi/joi';
import moment from 'moment';

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
            'relateiveDate.before': 'date must be before {{#days}} from {{#from}}',
            'relateiveDate.after': 'date must be before {{#days}} from {{#from}}',
        },
        rules: {
            before: {
                alias: 'lessThan',
                method(days) {
                    return this.$_addRule({ name: 'before', args: { days } });
                },
                args: [
                    {
                        name: 'days',
                        ref: true,
                        assert: (value) => typeof value === 'number' && !isNaN(value),
                        message: 'must be a number',
                    },
                ],
                validate(value, helpers, args, options) {
                    const mustBeBefore = getRelativeToDate().add(args.days, 'days');
                    const toValidate = moment(value);
                    if (!toValidate.isBefore(mustBeBefore)) {
                        return helpers.error('relateiveDate.before', {
                            days: args.days,
                            from: getRelativeToDate().format('DD-MM-YYYY'),
                        });
                    }
                },
            },
            after: {
                alias: 'greaterThan',
                method(days) {
                    return this.$_addRule({ name: 'after', args: { days } });
                },
                args: [
                    {
                        name: 'days',
                        ref: true,
                        assert: (value) => typeof value === 'number' && !isNaN(value),
                        message: 'must be a number',
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
}

const custom = Joi.extend(relativeDateValidator(moment('01-07-2019', 'DD-MM-YYYY').toDate()));

const schema = Joi.object({
    dueDate: custom.relativeDate().before('a'),
});
const x = schema.validate({ dueDate: '2019-01-01' });
console.log(x);
