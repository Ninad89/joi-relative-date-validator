import Joi, { Schema } from '@hapi/joi';
import moment from 'moment';
import relativeDateValidator from './index';

describe('Should do nothing', () => {
    it('Should give invalid date error', () => {
        const custom = Joi.extend(relativeDateValidator());
        const schema: Schema = custom.relativeDate().within(2, 'd');
        const result = schema.validate('INVALID_DATE');
        expect(result.error.message).toEqual('"value" must be a valid date');
    });

    it('Should throw error while configuring', () => {
        expect(() => {
            Joi.extend(relativeDateValidator('TEST'));
        }).toThrowError();
    });

    it('Should throw error while configuring schema unit value', () => {
        Joi.extend(relativeDateValidator());
        const custom = Joi.extend(relativeDateValidator());
        expect(() => {
            custom.relativeDate().within('a', 'd');
        }).toThrowError();
    });

    it('Should throw error while configuring schema unit', () => {
        Joi.extend(relativeDateValidator());
        const custom = Joi.extend(relativeDateValidator());
        expect(() => {
            custom.relativeDate().within(2, 'l');
        }).toThrowError();
    });

    it('Should not give error: within(2, "d") from today', () => {
        const custom = Joi.extend(relativeDateValidator());
        const schema: Schema = custom.relativeDate().within(2, 'd');
        const result = schema.validate(
            moment()
                .subtract(3, 'd')
                .toDate()
        );
        expect(result.error).toBeUndefined();
    });

    it('Should not give error: after(2, "d") from today', () => {
        const custom = Joi.extend(relativeDateValidator());
        const schema: Schema = custom.relativeDate().after(2, 'd');
        const result = schema.validate(
            moment()
                .add(3, 'd')
                .toDate()
        );
        expect(result.error).toBeUndefined();
    });

    it('Should not give error: within(2, "d") from 2018-10-29', () => {
        const custom = Joi.extend(relativeDateValidator('2018-10-29'));
        const schema: Schema = custom.relativeDate().within(2, 'd');
        const result = schema.validate('2018-10-26');
        expect(result.error).toBeUndefined();
    });

    it('Should not give error: after(2, "d") from 2018-10-29', () => {
        const custom = Joi.extend(relativeDateValidator('2018-10-29'));
        const schema: Schema = custom.relativeDate().after(2, 'd');
        const result = schema.validate('2018-11-01');
        expect(result.error).toBeUndefined();
    });

    it('Should give error: within(2, "d") from 2018-10-29', () => {
        const custom = Joi.extend(relativeDateValidator('2018-10-29'));
        const schema: Schema = custom.relativeDate().within(5, 'd');
        const result = schema.validate('2018-11-08');
        expect(result.error).not.toBeUndefined();
    });

    it('Should give error: after(2, "d") from 2018-10-29', () => {
        const custom = Joi.extend(relativeDateValidator('2018-10-29'));
        const schema: Schema = custom.relativeDate().after(5, 'd');
        const result = schema.validate('2018-10-31');
        expect(result.error).not.toBeUndefined();
    });
});
