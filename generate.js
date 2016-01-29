
var width = window.innerWidth,
    height = window.innerHeight;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-100)
    .linkDistance(10)
    .size([width, height]);

var svg = d3.select('body').append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    // .attr('preserveAspectRatio', 'xMidYMid')
    .attr('viewBox', '0 0 ' + width + ' ' + height )
    .style('background-color', 'rgba(0,0,0,0.1)')


function g(){

  var a = {
    nodes: [],
    links: []
  }

  // generate a region
  // generate vpc
  // generate subnet
  // generate security group
  // generate instance
  // generate volume

  var regions = [ 'us_east_1', 'us_west_1' ]

  regions.forEach(function(region_name){
    var current_region_index = a.nodes.length
    a.nodes.push({ name: region_name, type: 'region', group: 0 })

    // generate vpcs
    var n_vpcs = 1 + (Math.random() * 1)
    for(var i = 0; i < n_vpcs; i++){
      var current_vpc_index = a.nodes.length
      a.nodes.push({ name: 'vpc-'+rand_string(10), type: 'vpc', group: 1 })
      a.links.push({ source: current_vpc_index, target: current_region_index, value: 1 })

      // generate subnets
      var n_subnets = 1 + (Math.random() * 1)
      for(var j = 0; j < n_subnets; j++){
        var current_subnet_index = a.nodes.length
        a.nodes.push({ name: 'subnet-'+rand_string(10), type: 'subnet', group: 2 })
        a.links.push({ source: current_subnet_index, target: current_vpc_index, value: 1 })

        // generate security groups
        var n_sgs = 1 + (Math.random() * 1)
        for(var k = 0; k < n_sgs; k++){
          var current_sg_index = a.nodes.length
          a.nodes.push({ name: 'sg-'+rand_string(10), type: 'sg', group: 3 })
          a.links.push({ source: current_sg_index, target: current_subnet_index, value: 1 })

          // generate instances
          var n_instances = 1 + (Math.random() * 1)
          for(var l = 0; l < n_instances; l++){
            var current_instance_index = a.nodes.length
            a.nodes.push({ name: 'i-'+rand_string(10), type: 'instance', group: 4 })
            a.links.push({ source: current_instance_index, target: current_sg_index, value: 1 })

            // generate volumes
            var n_volumes = 1 + (Math.random() * 3)
            for(var m = 0; m < n_volumes; m++){
              var current_volume_index = a.nodes.length
              a.nodes.push({ name: 'vol-'+rand_string(10), type: 'volume', group: 5 })
              a.links.push({ source: current_volume_index, target: current_instance_index, value: 1 })
            }

          }

        }

      }



    }

  })

  return a

}

function rand_string(len){
  var k = []
  var data = 'abcdefghijklmnopqrstuvwxyz'
  while(k.length < len){
    k.push(data[Math.floor(Math.random()*data.length)])
  }
  return k.join('');
}


var graph = g()

console.log(graph)

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll('.link')
      .data(graph.links)
    .enter().append('line')
      .attr('class', 'link')
      .style('stroke-width', function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll('.node')
      .data(graph.nodes)
    .enter().append('g').attr('class', 'node')

  var nodes = node.append('circle')
      .attr('class', 'node')
      .attr('r', function(d){ return (30-(d.group*d.group)) })
      .style('fill', function(d) { return color(d.group); })
      .style('stroke', 'none')
      .call(force.drag)

  var text_nodes = node.append('text').text(function(d){ return d.name })
          .attr('x',0).attr('y',0)
          .attr('text-anchor', 'middle')
          .attr('fill', 'black')
          .attr('stroke', 'none')
          .style('font-family', 'monospace')
          .style('font-size', function(d){ return (10-d.group)})


  // node.append('title')
  //     .text(function(d) { return d.name; });

  force.on('tick', function() {
    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    nodes.attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });

    text_nodes.attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y; });
  });
