import Joi,{ Extension } from 'joi';
import moment from 'moment';
import getAfterValidator from './lib/afterValidator';
import getWithinValidator from './lib/withinValidator';

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
            within: getWithinValidator(relativeTo),
            after: getAfterValidator(relativeTo)
        },
    };
}
