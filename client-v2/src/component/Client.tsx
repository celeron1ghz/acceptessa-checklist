import useSWR, { SWRResponse } from "swr";

export function getCircleData(exhibition_id: string): SWRResponse<CircleListResponse, any, { suspense: true }> {
  return useSWR('circle', () => {
    return fetch('https://data.familiar-life.info/' + exhibition_id + '.json')
      .then(data => data.ok ? data : Promise.reject(data))
      .then(data => data.json())
      .then(data => {
        let circleList = data.circles;

        // for circle of not upload circlecut, padding not uploaded image.
        for (const c of circleList) {
          if (!c.circlecut) {
            c.circlecut = `/${exhibition_id}/not_uploaded.png?_=${c.circle_id}`;
          }
        }

        // let sorter;
        // if (data.sort_order) {
        //   const sortMap = _.zipObject(data.sort_order, _.range(data.sort_order.length));
        //   sorter = (a, b) => {
        //     if (sortMap[a] && !sortMap[b]) {
        //       return 1;
        //     }
        //     if (!sortMap[a] && sortMap[b]) {
        //       return -1;
        //     }
        //     if (sortMap[a] > sortMap[b]) {
        //       return 1;
        //     }
        //     if (sortMap[a] < sortMap[b]) {
        //       return -1;
        //     }
        //     return 0;
        //   };

        //   circleList = circleList.sort((a, b) => {
        //     const sym = sorter(a.space_sym, b.space_sym);
        //     if (sym !== 0) return sym;

        //     if (a.space_num > b.space_num) {
        //       return 1;
        //     }
        //     if (a.space_num < b.space_num) {
        //       return -1;
        //     }
        //     return 0;
        //   });
        // }

        const ret: CircleListResponse = {
          type: 'success',
          circleList: circleList as Array<Circle>,
          exhibition: data.exhibition,
          map: data.map,
        };

        return ret;
      }).catch(err => {
        const ret: CircleListResponse = {
          type: 'error',
          error: err,
        };

        return ret;
      });
  }, { suspense: true });
}
