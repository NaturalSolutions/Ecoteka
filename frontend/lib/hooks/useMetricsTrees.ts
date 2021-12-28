import useApi from "@/lib/useApi";

export interface MetricTreesResponse {
    ratio : object;
    aggregates : object;
    speciesAggregates : [];
    canonicalNameTotalCount : number;
    mostRepresentedTaxa : [];
}

function useMetricsTrees(organizationId) {
  
  return async (): Promise<MetricTreesResponse | {}> => {
    const { apiETK } = useApi().api;

    const sumCanonicalName = (data) => {
      const reducer = data.reduce((a, b) => ({ total: a.total + b.total }));
      return reducer.total;
    };

    try {
      const { data, status } = await apiETK.get(
        `/organization/${organizationId}/trees/metrics?fields=canonicalName,vernacularName,diameter,height,plantingDate`
      );
      if (status === 200) {
        let ratio = data.ratio
        let aggregates = data.aggregates
        let speciesAggregates = []
        let canonicalNameTotalCount = 0
        let mostRepresentedTaxa = []
        if(data?.aggregates?.canonicalName) 
        {speciesAggregates = data.aggregates.canonicalName
          if (speciesAggregates.length > 0) {
            canonicalNameTotalCount = sumCanonicalName(speciesAggregates)
            mostRepresentedTaxa = speciesAggregates
            .filter((f) => {
              return f.value !== " ";
            })
            .slice(0, 6)
        }
        }
        return { ratio, aggregates, speciesAggregates, canonicalNameTotalCount, mostRepresentedTaxa } as unknown as MetricTreesResponse;
      }
    } catch ({ response, request }) {
      return response.error;
    }
  };
}

export default useMetricsTrees;
