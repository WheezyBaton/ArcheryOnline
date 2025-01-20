export const calculateSeriesStats = (serie) => {
      const sum = serie.reduce((acc, score) => acc + score, 0);
      const count10 = serie.filter((score) => score === 10).length;
      const count9 = serie.filter((score) => score === 9).length;
      return { sum, count10, count9 };
};

export const calculateTotalScore = (series) => {
      return series.reduce(
            (total, serie) =>
                  total + serie.reduce((acc, score) => acc + score, 0),
            0
      );
};

export const handleSeriesChange = (series, seriesIndex, shotIndex, value) => {
      const newSeries = [...series];
      newSeries[seriesIndex][shotIndex] = parseInt(value, 10);
      return newSeries;
};
