/**
 * Created by Tom.Ridd on 05/05/2017.
 */

function barchart(container_id, title, categories, category_label, series) {
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
                text: data.y_label
            }
        },
        series: series
});}

function drawBarchart(filteredData, primary_column, secondary_column) {
    dataRows = _.clone(filteredData);
    headerRow = dataRows.shift();

    column1 = $('#primary_column').val();
    column2 = $('#secondary_column').val();

    var chartObject = null;
    if(column2 === '[None]') {
        chartObject = barchartObject(headerRow, dataRows, column1);
    } else {
        chartObject = barchartDoubleObject(headerRow, dataRows, column1, column2);
    }
    barchart('container', 'Preview', chartObject.categories, column1, chartObject.data);
}

function barchartObject(headerRow, dataRows, category) {
    valueIndex = headerRow.indexOf('Value');
    categoryIndex = headerRow.indexOf(category);
    categories = uniqueDataInColumn(dataRows, categoryIndex);

    values = [];
    for(c in categories) {
        values.push(valueForCategory(dataRows, categoryIndex, valueIndex, categories[c]));
    }

    return {'categories':categories, 'data': [{'name':category, 'data': values}]}
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

    return {'categories':categories, 'data': seriesData};
}

function uniqueDataInColumn(data, index) {
    values = _.map(data.slice(start = 1), function(item) {
        return item[index]; });
    return _.uniq(values).sort();
}