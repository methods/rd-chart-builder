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