/**
 * Created by Tom.Ridd on 05/05/2017.
 */

function barchart(container_id, chartObject) {
    return Highcharts.chart(container_id, {
        chart: {
            type:'bar'
        },
        title: {
            text: chartObject.title.text
        },
        xAxis: {
            categories: chartObject.xAxis.categories,
            title: {
                text: chartObject.xAxis.title.text
            }
        },
        yAxis: {
            title: {
                text: chartObject.yAxis.title.text
            }
        },
        series: chartObject.series
    });}

function drawBarchart(container_id, filteredData, primary_column, secondary_column) {

    var chartObject = barchartObject(filteredData, primary_column, secondary_column);

    barchart(container_id, chartObject);
}

function barchartObject(filteredData, primary_column, secondary_column) {
    dataRows = _.clone(filteredData);
    headerRow = dataRows.shift();

    if(secondary_column === '[None]') {
        return barchartSingleObject(headerRow, dataRows, primary_column);
    } else {
        return barchartDoubleObject(headerRow, dataRows, primary_column, secondary_column);
    }
}

function barchartSingleObject(headerRow, dataRows, category) {
    valueIndex = headerRow.indexOf('Value');
    categoryIndex = headerRow.indexOf(category);
    categories = uniqueDataInColumn(dataRows, categoryIndex);

    values = [];
    for(c in categories) {
        values.push(valueForCategory(dataRows, categoryIndex, valueIndex, categories[c]));
    }

    return {
        'type':'bar',
        'title':{'text':'Bar Chart'},
        'xAxis':{'title':{'text':category}, 'categories':categories},
        'yAxis':{'title':{'text':'Percentage'}},
        'series': [{'name':category, 'data': values}]}
}

function valueForCategory(dataRows, categoryIndex, valueIndex, categoryValue) {
    for(r in dataRows) {
        if(dataRows[r][categoryIndex] === categoryValue) {
            return parseFloat(dataRows[r][valueIndex]);
        }
    }
    return 0;
}

function barchartDoubleObject(headerRow, dataRows, category1, category2) {
    valueIndex = headerRow.indexOf('Value');
    categoryIndex = headerRow.indexOf(category1);
    categories = uniqueDataInColumn(dataRows, categoryIndex);

    seriesIndex = headerRow.indexOf(category2);
    series = uniqueDataInColumn(dataRows, seriesIndex);

    seriesData = [];
    for(s in series) {
        seriesRows = _.filter(dataRows, function(row) { return row[seriesIndex] === series[s];});
        values = [];
        for(c in categories) {
            values.push(valueForCategory(seriesRows, categoryIndex, valueIndex, categories[c]));
        }
        seriesData.push({'name':series[s], 'data': values});
    }

    return {
        'type':'bar',
        'title':{'text':'Double bar Chart'},
        'xAxis':{'title':{'text':category1}, 'categories':categories},
        'yAxis':{'title':{'text':'Percentage'}},
        'series': seriesData};
}

function uniqueDataInColumn(data, index) {
    values = _.map(data.slice(start = 1), function(item) {
        return item[index]; });
    return _.uniq(values).sort();
}





function drawLinechart(container_id, filteredData, categories_column, series_column) {
    dataRows = _.clone(filteredData);
    headerRow = dataRows.shift();

    chartObject = linechartObject(headerRow, dataRows, categories_column, series_column);

    linechart(container_id, 'Preview', chartObject.categories, categories_column, chartObject.data);
}

function linechartObject(headerRow, dataRows, categories_column, series_column) {
    valueIndex = headerRow.indexOf('Value');
    categoryIndex = headerRow.indexOf(categories_column);
    categories = uniqueDataInColumn(dataRows, categoryIndex);

    seriesIndex = headerRow.indexOf(series_column);
    seriesNames = uniqueDataInColumn(dataRows, seriesIndex);

    chartSeries = [];
    for(s in seriesNames) {
        seriesName = seriesNames[s];
        values = [];
        for(c in categories) {
            category = categories[c];
            values.push(valueForCategoryAndSeries(dataRows, categoryIndex, category, seriesIndex, seriesName, valueIndex));
        }
        chartSeries.push({'name':seriesName, 'data':values});
    }

    return {'categories':categories, 'data': chartSeries}
}

function valueForCategoryAndSeries(dataRows, categoryIndex, categoryValue, seriesIndex, seriesValue, valueIndex) {
    for(r in dataRows) {
        if((dataRows[r][categoryIndex] === categoryValue) && (dataRows[r][seriesIndex] === seriesValue)) {
            return parseFloat(dataRows[r][valueIndex]);
        }
    }
    return 0;
}

function linechart(container_id, title, categories, category_label, series, units) {
    return Highcharts.chart(container_id, {

        title: {
            text: title
        },
        xAxis: {
            categories: categories,
            title: {
                text: category_label
            }
        },
        yAxis: {
            title: {
                text: units
            }
        },
        series: series
    });}


function drawComponentChart(container_id, filteredData, grouping_column, series_column) {
    dataRows = _.clone(filteredData);
    headerRow = dataRows.shift();

    chartObject = componentChartObject(headerRow, dataRows, grouping_column, series_column);

    componentChart(container_id, 'Preview', chartObject.categories, grouping_column, chartObject.data);
}

function componentChartObject(headerRow, dataRows, grouping_column, series_column) {
    valueIndex = headerRow.indexOf('Value');
    groupingIndex = headerRow.indexOf(grouping_column);
    groups = uniqueDataInColumn(dataRows, groupingIndex);

    seriesIndex = headerRow.indexOf(series_column);
    seriesNames = uniqueDataInColumn(dataRows, seriesIndex);

    chartSeries = [];
    for(s in seriesNames) {
        seriesName = seriesNames[s];
        values = [];
        for(g in groups) {
            group = groups[g];
            values.push(valueForCategoryAndSeries(dataRows, groupingIndex, group, seriesIndex, seriesName, valueIndex));
        }
        chartSeries.push({'name':seriesName, 'data':values});
    }

    return {'categories':groups, 'data': chartSeries}
}

function componentChart(container_id, title, categories, category_label, series, units) {
    return Highcharts.chart(container_id, {
        chart: {
            type:'bar'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: categories,
            title: {
                text: category_label
            }
        },
        yAxis: {
            title: {
                text: units
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: series
    });}