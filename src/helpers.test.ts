import { formattedTime } from './helpers';

const testData: any = {
  5: '0:05',
  10: '0:10',
  59: '0:59',
  60: '1:00',
  3599: '59:59',
  3600: '1:00:00',
};

describe('formattedTime', () => {
  for (let time  of Object.keys(testData)) {
    it('returns correctly formatted time', () => {
      expect(
        formattedTime(Number(time) * 1000)
      ).toEqual(testData[time]);
    });
  }
});
