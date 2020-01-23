import Joi from '@hapi/joi';
import { Extension, RuleArgs } from '@hapi/joi';
import moment from 'moment';

export default function relativeDateValidator(): Extension {
    return {
        type: 'relativeDate',
        base: Joi.date(),
        messages: {
            'relateiveDate.before': 'date must be before {{#days}} from today',
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
                        assert: (value) =>
                            typeof value === 'number' && !isNaN(value),
                        message: 'must be a number',
                    },
                ],
                validate(value, helpers, args, options) {
                    const mustBeBefore = moment().add(args.days, 'days');
                    const toValidate = moment(value);
                    if (!toValidate.isBefore(mustBeBefore)) {
                        return helpers.error('relateiveDate.before', {
                            days: args.days,
                        });
                    }
                },
            },
        },
    };
}

const custom = Joi.extend(relativeDateValidator());

const schema = Joi.object({
    dueDate: custom.relativeDate().before(7),
});
const x = schema.validate({ dueDate: '2020-02-04' });
