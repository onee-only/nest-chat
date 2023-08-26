import { Test, TestingModule } from '@nestjs/testing';
import { NullishFilter, ObjectValidator } from '../providers';

describe('NullishFilter', () => {
    let nullishFilter: NullishFilter;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [NullishFilter, ObjectValidator],
        }).compile();

        nullishFilter = module.get(NullishFilter);
    });

    it('should filter the nullish property', () => {
        // given
        const obj = {
            hello: true,
            nullish: null,
        };

        // when
        const filtered = nullishFilter.execute(obj);
        // then
        expect(filtered.hasOwnProperty('nullish')).toEqual(false);
    });

    it('should filter the nested nullish property', () => {
        // given
        const obj = {
            hello: true,
            nullish: {
                nested: undefined,
                notnull: true,
            },
        };

        // when
        const filtered = nullishFilter.execute(obj);
        // then
        expect(filtered.hasOwnProperty('nullish')).toEqual(true);
        expect(filtered.nullish?.hasOwnProperty('nested')).toEqual(false);
        expect(filtered.nullish?.hasOwnProperty('notnull')).toEqual(true);
    });

    it('should filter the parent of the nested nullish property', () => {
        // given
        const obj = {
            hello: true,
            nullish: {
                nested: undefined,
            },
        };

        // when
        const filtered = nullishFilter.execute(obj);
        // then
        expect(filtered.hasOwnProperty('nullish')).toEqual(false);
    });

    it('should the empty object', () => {
        // given
        const obj = {
            hello: true,
            empty: {},
        };

        // when
        const filtered = nullishFilter.execute(obj);
        // then
        expect(filtered.hasOwnProperty('empty')).toEqual(false);
    });

    it('benchmark!', () => {
        // given
        const obj = {
            hello: true,
            nullish: {
                hi: undefined,
                hey: 'hi',
                hey1: 'hi2',
                fhey: 'hid',
                hhey: 'hi',
                lhey: 'hi',
                lhey1: 'hi2',
                lfhey: 'hid',
                lhhey: 'hi',
                khey: 'hi',
                khey1: 'hi2',
                kfhey: 'hid',
                khhey: 'hi',
                klhey: 'hi',
                klhey1: 'hi2',
                klfhey: 'hid',
                klhhey: 'hi',
            },
            hey: 'hi',
            hey1: 'hi2',
            fhey: 'hid',
            hhey: 'hi',
            lhey: 'hi',
            lhey1: 'hi2',
            lfhey: 'hid',
            lhhey: 'hi',
            khey: 'hi',
            khey1: 'hi2',
            kfhey: 'hid',
            khhey: 'hi',
            klhey: 'hi',
            klhey1: 'hi2',
            klfhey: 'hid',
            klhhey: 'hi',
        };

        // when
        const filtered = nullishFilter.execute(obj);
        // then
        expect(filtered.hasOwnProperty('nullish')).toEqual(true);
        expect(filtered.nullish?.hasOwnProperty('hi')).toEqual(false);
    });
});
