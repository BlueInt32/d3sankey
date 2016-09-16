function getData(datasetIndex) {

  var datasets = [{
    'nodes': [{
      'node': 0,
      'type': 'root',
      'title': 'Nutt Butter Chocolate',
      'subtitle': 'Earth Nuts Inc.',
      'xpos': 0
    }, {
      'node': 1,
      'type': 'normal',
      'title': 'Cocoa Butter',
      'xpos': 1
    }, {
      'node': 2,
      'type': 'normal',
      'title': 'Crazy Nuts Inc.',
      'xpos': 2,
      'flag': 'warning'
    }, {
      'node': 3,
      'type': 'normal',
      'title': 'World Nuts Inc.',
      'xpos': 2,
      'flag': 'warning'
    }, {
      'node': 4,
      'type': 'normal',
      'title': 'Dry Roasted Hazelnuts',
      'subtitle': 'All Nuts Inc.',
      'xpos': 1,
      'flag': 'warning'
    }, {
      'node': 5,
      'type': 'small',
      'title': '?',
      'xpos': 2
    }, {
      'node': 6,
      'type': 'normal',
      'title': 'Hazelnuts',
      'subtitle': "Cooperative - Paula's Nut Farm",
      'status': 'known',
      'xpos': 2
    }, {
      'node': 7,
      'type': 'normal',
      'title': 'Evaporated sugar cane juice',
      'subtitle': 'Crazy Nuts Inc.',
      'xpos': 1,
      'flag': 'ok'
    }, {
      'node': 8,
      'type': 'normal',
      'title': 'Sugar Cane',
      'xpos': 2
    }, {
      'node': 9,
      'type': 'normal',
      'title': 'Cooperative - Bianchi Sugar Farm',
      'xpos': 3
    }, {
      'node': 10,
      'type': 'normal',
      'title': 'Cooperative - Romano Sugar Farm',
      'xpos': 3
    }, {
      'node': 11,
      'type': 'normal',
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