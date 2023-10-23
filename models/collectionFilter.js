import Model from './model.js';

export default class CollectionFilter extends Model {
    constructor(data, params, model) {
        super();
        this.data = data;
        this.params = params;
        this.model = model;
    }

    get() {
        if (!this.params || !this.data) {
            return this.data;
        }
    
        let filteredData = [...this.data];
    
        if (this.params.sort) {
            const [sortField, sortOrder = 'asc'] = this.params.sort.split(',');
            if (sortField === 'Title' || sortField === 'Category') {
                filteredData.sort((a, b) => {
                    const aValue = a[sortField].toLowerCase();
                    const bValue = b[sortField].toLowerCase();
                    if (sortOrder === 'asc') {
                        return aValue.localeCompare(bValue);
                    } else if (sortOrder === 'desc') {
                        return bValue.localeCompare(aValue);
                    }
                });
            }
        }
    
        if (this.params.field) {
            const fieldData = this.getFieldData(this.params.field);
            return fieldData;
        }
    
        if (this.params.Title) {
            filteredData = this.filterData(filteredData, 'Title', this.params.Title);
        }
    
        if (this.params.Category) {
            filteredData = this.filterData(filteredData, 'Category', this.params.Category);
        }
    
        if (this.params.limit) {
            let limit = parseInt(this.params.limit);
            let offset = this.params.offset ? parseInt(this.params.offset) : 0;
    
            if (offset > 0) {
                filteredData = this.getLimitData(filteredData, limit, offset);
            } else {
                filteredData = filteredData.slice(0, limit);
            }
        }
    
        return filteredData;
    }
    
    getLimitData(data, limit, offset) {
        if (data && limit >= 0) {
            const sortedData = data.slice().sort((a, b) => a.Id - b.Id);
    
            if (offset >= 0) {
                const limitedData = sortedData.slice(offset, limit + offset);
                return limitedData;
            } else {
                return sortedData.slice(0, limit);
            }
        }
        return data;
    }
    

    filterData(data, filterAttribute, filter) {
        return data.filter(item => {
            const itemValue = item[filterAttribute].toLowerCase();
            const searchString = filter.toLowerCase();

            if (searchString.startsWith('*') && searchString.endsWith('*')) {
                return itemValue.includes(searchString.slice(1, -1));
            } else if (searchString.startsWith('*')) {
                return itemValue.endsWith(searchString.substring(1));
            } else if (searchString.endsWith('*')) {
                return itemValue.startsWith(searchString.slice(0, -1));
            } else {
                return itemValue === searchString;
            }
        });
    }

    getFieldData(fieldNames) {
        if (!Array.isArray(fieldNames)) {
            fieldNames = fieldNames.split(',').map(fieldName => fieldName.trim());
        }
    
        const filteredData = this.data.map(item => {
            const extractedFields = {};
            fieldNames.forEach(fieldName => {
                for (const key in item) {
                    if (key.toLowerCase() === fieldName.toLowerCase()) {
                        extractedFields[fieldName] = item[key];
                        break;
                    }
                }
            });
            return extractedFields;
        });
    
        return filteredData;
    }
    
    
    
}
