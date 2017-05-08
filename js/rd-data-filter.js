/**
 * Created by Tom.Ridd on 08/05/2017.
 */

function filterData(data, filter) {
    indexFilter = textFilterToIndexFilter(data, filter);
    return applyFilter(data, indexFilter);
}

function textFilterToIndexFilter(data, textFilter) {
    indexFilter = {};
    headers = data[0];

    for(key in textFilter) {
        i = headers.indexOf(key);
        indexFilter[i] = textFilter[key];
    }

    return indexFilter;
}

function applyFilter(data, indexFilter){
    data2 = _.clone(data);

    headerRow = data2.shift();
    filteredRows = [];

    for(d in data2) {
        datum = data2[d];
        if(itemPassesFilter(datum, indexFilter)) {
            filteredRows.push(datum);
        }
    }

    filteredRows.unshift(headerRow);
    return filteredRows;
}

function itemPassesFilter(item, filter) {
    for(index in filter) {
        if (item[index] !== filter[index]) {
            return false;
        }
    }
    return true;
}