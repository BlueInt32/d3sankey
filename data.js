
function getData(datasetIndex) {

    var datasets = [{
      'nodes':[
        {'node':0,'name':'Butter Chocolate', 'type':'product', 'owner': 'Earth Nuts Inc.'},
        {'node':1,'name':'Cocoa Butter', 'type': 'product', 'owner': 'Crazy Nuts Inc.'},
        {'node':2,'name':'node1', 'type': '_expander'},
        {'node':3,'name':'node3'},
        {'node':4,'name':'node4'},
        {'node':5,'name':'node5'},
        {'node':6,'name':'node6'},
        {'node':7,'name':'node7'}
      ],
      'links':[
        {'source':0,'target':2,'value':25},
        {'source':1,'target':2,'value':5},
        {'source':1,'target':3,'value':20},
        {'source':2,'target':4,'value':29},
        {'source':2,'target':5,'value':1},
        {'source':3,'target':4,'value':10},
        {'source':3,'target':5,'value':2},
        {'source':3,'target':6,'value':8},
        {'source':4,'target':7,'value':39},
        {'source':5,'target':7,'value':3},
        {'source':6,'target':7,'value':8}
      ]
    },
    {
      'nodes':[
        {'node':0,'name':'node0'},
        {'node':1,'name':'node1'},
      ],
      'links':[
        {'source':0,'target':1,'value':25}
      ]
    }];
    return datasets[datasetIndex];
}