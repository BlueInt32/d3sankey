function getData(datasetIndex) {

  var datasets = [{
    'nodes': [{
      'node': 0,
      'title': 'Nutt Butter Chocolate',
      'subtitle': 'Earth Nuts Inc.',
      'status': 'known',
      'root': 'true',
      'xpos': 0
    }, {
      'node': 1,
      'title': 'Cocoa Butter',
      'status': 'known',
      'xpos': 1
    }, {
      'node': 2,
      'title': 'Crazy Nuts Inc.',
      'status': 'known',
      'xpos': 2
    }, {
      'node': 3,
      'title': 'World Nuts Inc.',
      'status': 'known',
      'xpos': 2
    }, {
      'node': 4,
      'title': 'Dry Roasted Hazelnuts',
      'subtitle': 'All Nuts Inc.',
      'status': 'known',
      'xpos': 1
    }, {
      'node': 5,
      'title': '?',
      'status': 'unknown',
      'xpos': 2
    }, {
      'node': 6,
      'title': 'Hazelnuts',
      'subtitle': "Cooperative - Paula's Nut Farm",
      'status': 'known',
      'xpos': 2
    }, {
      'node': 7,
      'title': 'Evaporated sugar cane juice',
      'subtitle': 'Crazy Nuts Inc.',
      'xpos': 1
    }, {
      'node': 8,
      'title': 'Sugar Cane',
      'xpos': 2
    }, {
      'node': 9,
      'title': 'Cooperative - Bianchi Sugar Farm',
      'xpos': 3
    }, {
      'node': 10,
      'title': 'Cooperative - Romano Sugar Farm',
      'xpos': 3
    }, {
      'node': 11,
      'title': 'Cooperative - Yamamoto Sugar Farm',
      'xpos': 3
    }],
    'links': [{
      'source': 0,
      'target': 1,
      'value': 1
    }, {
      'source': 0,
      'target': 4,
      'value': 1
    }, {
      'source': 0,
      'target': 7,
      'value': 1
    }, {
      'source': 1,
      'target': 2,
      'value': 1
    }, {
      'source': 1,
      'target': 3,
      'value': 1
    }, {
      'source': 4,
      'target': 5,
      'value': 1
    }, {
      'source': 4,
      'target': 6,
      'value': 1
    }, {
      'source': 7,
      'target': 8,
      'value': 3
    }, {
      'source': 8,
      'target': 9,
      'value': .2
    }, {
      'source': 8,
      'target': 10,
      'value': .2
    }, {
      'source': 8,
      'target': 11,
      'value': .2
    }]
  }, {
    'nodes': [{
      'node': 0,
      'title': 'node0'
    }, {
      'node': 1,
      'title': 'node1'
    }, ],
    'links': [{
      'source': 0,
      'target': 1,
      'value': 2
    }]
  }];
  return datasets[datasetIndex];
}