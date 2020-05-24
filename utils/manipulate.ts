import _ from "lodash";

class Manipulator {
  constructor() {}

  mergeJSONArr(array: any, groupKey: string) {
    return _(array)
      .groupBy(groupKey)
      .map((objs, key) => ({
        [groupKey]: new Date(parseInt(key.split("-")[0]), parseInt(key.split("-")[1]) - 1, parseInt(key.split("-")[2])),
        SO2: _.meanBy(objs, "SO2"),
        NO2: _.meanBy(objs, "NO2"),
        O3: _.meanBy(objs, "O3"),
        CO: _.meanBy(objs, "CO"),
      }))
      .value();
  }

  mergeJSONArrayLarge(array: any, groupKey1: string, groupKey2: string) {
    let group1Merge : any = _.groupBy(array, groupKey1);
    _.forEach(group1Merge, (value, key) => {
      group1Merge[key] = _(group1Merge[key]).groupBy(groupKey2)
                          .map((objs2 : any, key2 : any) => ({
        [groupKey2]: new Date(parseInt(key2.split("-")[0]), parseInt(key2.split("-")[1]) - 1, parseInt(key2.split("-")[2])),
        SO2: _.meanBy(objs2, "SO2"),
        NO2: _.meanBy(objs2, "NO2"),
        O3: _.meanBy(objs2, "O3"),
        CO: _.meanBy(objs2, "CO"),
      }))
      .value();
    });
    return group1Merge;
  }
}

export { Manipulator };
