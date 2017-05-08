/**
 * Created by Tom.Ridd on 08/05/2017.
 */


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





function linechartObject(filteredData, categories_column, series_column) {
    dataRows = _.clone(filteredData);
    headerRow = dataRows.shift();

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

    return {
        'type':'line',
        'title':{'text':'Line Chart'},
        'xAxis':{'title':{'text':categories_column}, 'categories':categories},
        'yAxis':{'title':{'text':'Percentage'}},
        'series': chartSeries};
}

function valueForCategoryAndSeries(dataRows, categoryIndex, categoryValue, seriesIndex, seriesValue, valueIndex) {
    for(r in dataRows) {
        if((dataRows[r][categoryIndex] === categoryValue) && (dataRows[r][seriesIndex] === seriesValue)) {
            return parseFloat(dataRows[r][valueIndex]);
        }
    }
    return 0;
}





function componentChartObject(filteredData, grouping_column, series_column) {
    dataRows = _.clone(filteredData);
    headerRow = dataRows.shift();

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

    return {
        'type':'component',
        'title':{'text':'Component Chart'},
        'xAxis':{'title':{'text':grouping_column}, 'categories':groups},
        'yAxis':{'title':{'text':'Percentage'}},
        'series': chartSeries};
}