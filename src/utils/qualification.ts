import { TeamSeasonDoubleFixture } from '../api';

export function createTree(fixtures: TeamSeasonDoubleFixture[][]) {
  return fixtures.reduceRight<Array<Array<TeamSeasonDoubleFixture | undefined>>>((result, fixtures, i, arr) => {
    const length = Math.pow(2, arr.length - 1 - i);
    if (result.length === 0 || fixtures.length === 0) {
      result.unshift(fixtures.length > 0 ? fixtures : Array.from(new Array(length)));
    } else {
      let temp = result[0]?.reduce<TeamSeasonDoubleFixture[]>((newArr, prev) => {
        if (prev) {
          const ids = [prev.localteam_id, prev.visitorteam_id];
          newArr.push(...fixtures.filter(fixture => ids.includes(fixture.localteam_id) || ids.includes(fixture.visitorteam_id)));
        }
        return newArr;
      }, []);
      if (temp) {
        if (temp.length < length) {
          temp = Array.from(new Set(temp.concat(fixtures)));
          temp.length = length;
        }
        result.unshift(temp);
      }
    }

    return result;
  }, []);
}
