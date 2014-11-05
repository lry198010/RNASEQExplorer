//var drawQCdistribution = function(title, data){
//   var div = document.createElement("div");
//   div.innerHTML("Test for quality distribution");
//   document.body.appendChild(div);
//}

//drawQCdistribution("QC distribution",data);

var getTotalBasePerPosition = function(data){
  var total = 0;
  
}

$(document).ready(function(){
  $("#testIt").click(function(){
    drawBox("#Quality",data[1].data,1038,400,10,10,10,10,2,2);
  }); 
})

// w, h: svg width and height
// mt,mr,mb,ml: margin top, margin right, margin bottom, margin left
// mil, mil: margin left of box, margin right of box
// d = [base,mean,median,lq,uq,10q,90q]
var drawBox = function(appendTo, d, w, h, mt,mr,mb,ml,mil,mir){
   //var svg = d3.select("#Quality_svg") ? d3.select("#Quality_svg") : d3.select(appendTo).append("svg").attr("width",w).attr("height",h).attr("id","Quality_svg")
   var svg = d3.select(appendTo).append("svg").attr("width",w)
                                              .attr("height",h)
                                              .attr("id","Quality_svg")
                                              .attr("background-color","#dddddd")
   //svg.attr("width",w).attr("height",h);
   var axisH = 50;
   var maxQual = 45;
   var innerW = w - ml - mr;
   var innerH = h - mt - mb - axisH;
   var boxWidth = innerW/d.length;
   var perHeight = innerH / maxQual;
   
   var fontsize = 30;
   
   var i = 0;
   var j = 0;
   var meanPloy = [];//left,middle,right
   var tickValues = []
   
   for(i=0;i<d.length;i++){
     meanPloy[j++] = (i + 0.5) * boxWidth + ml;
     meanPloy[j++] = (maxQual - d[i][1]) * perHeight + mt; 
     tickValues[i] = i + 0.5;
   }
   //console.log(meanPloy.join(" "));
   svg.append("text")
      .text("ok")
      .attr("class","textts")
      .attr("x",100 + "px")
      .attr("y",350 + "px")
      .attr("text-anchor","middle")
      .attr("id","tok");
   svg.append("line")
      .attr("x1",100 + "px")
      .attr("x2",100 + "px")
      .attr("y1",350 + "px")
      .attr("y2",(350 - fontsize) + "px")
      .attr("stroke","red");
   svg.append("line")
      .attr("x1",100 + "px")
      .attr("x2",(100 + fontsize * 2) + "px")
      .attr("y1",(350 - fontsize) + "px")
      .attr("y2",(350 - fontsize) + "px")
      .attr("stroke","red");

   svg.append("line")
      .attr("x1",ml)
      .attr("x2",ml)
      .attr("y1",mt)
      .attr("y2",mt + innerH)
      .attr("stroke","black");
 //  svg.append("line")
 //     .attr("x1",ml)
 //     .attr("x2",ml + innerW)
 //     .attr("y1",mt + innerH)
 //     .attr("y2",mt + innerH)
 //     .attr("stroke","black");
 var Xscalar = d3.scale.linear().domain([0,101]).range([0,innerW])

  svg.append("g").attr("class","axis")
                 .attr("transform","translate(" + ml + "," + (h-ml-axisH) + ")")
                 .call(d3.svg.axis().scale(Xscalar).orient("bottom").tickValues(tickValues))
                 .selectAll("text")
                 .attr("x",function(d,i){return 20;})
                 .attr("y",0)
                 .attr("dy",".35em")
                 .attr("transform", "rotate(90)");
   
 //  svg.selectAll("line.aix").data(d).enter().append("line")
 //                           .attr("x1",function(d,i){return (i + 0.5) * boxWidth + ml;})
 //                           .attr("y1",function(d){return innerH + mt;})
 //                           .attr("x2",function(d,i){return (i + 0.5) * boxWidth + ml;})
 //                           .attr("y2",function(d){return innerH + mt + 5;})
 //                           .attr("stroke","black")
   svg.selectAll("rect").data(d).enter().append("rect")
                        .attr("x",function(d,i){return i * boxWidth + mil + ml;})
                        .attr("y",function(d,i){return (maxQual - d[4]) * perHeight + mt;})
                        .attr("width",boxWidth - mil - mir)
                        .attr("height",function(d){return (d[4] - d[3]) * perHeight;})
                        .attr("stroke","black")
                        .attr("sroke-width",1)
                        .attr("fill","none");
  svg.selectAll("line.Median").data(d).enter().append("line")
                        .attr("x1",function(d,i){return i * boxWidth + mil + ml;})
                        .attr("y1",function(d){return (maxQual - d[2]) * perHeight + mt;})
                        .attr("x2",function(d,i){return (i+1) * boxWidth - mir + ml;})
                        .attr("y2",function(d){return (maxQual - d[2]) * perHeight + mt;})
                        .attr("stroke","green");
  svg.selectAll("line.dw").data(d).enter().append("line")
                        .attr("x1",function(d,i){return i * boxWidth + mil + ml;})
                        .attr("y1",function(d){return (maxQual - d[5]) * perHeight + mt;})
                        .attr("x2",function(d,i){return (i+1) * boxWidth - mir + ml;})
                        .attr("y2",function(d){return (maxQual - d[5]) * perHeight + mt;})
                        .attr("stroke","red");
  svg.selectAll("line.dwcent").data(d).enter().append("line")
                        .attr("x1",function(d,i){return (i + 0.5) * boxWidth + ml;})
                        .attr("y1",function(d){return (maxQual - d[5]) * perHeight + mt;})
                        .attr("x2",function(d,i){return (i + 0.5) * boxWidth + ml;})
                        .attr("y2",function(d){return (maxQual - d[3]) * perHeight + mt;})
                        .attr("stroke","red")
                        .attr("stroke-dasharray","5,2");
   
  svg.selectAll("line.up").data(d).enter().append("line")
                        .attr("x1",function(d,i){return i * boxWidth + mil + ml;})
                        .attr("y1",function(d){return (maxQual - d[6]) * perHeight + mt;})
                        .attr("x2",function(d,i){return (i+1) * boxWidth - mir + ml;})
                        .attr("y2",function(d){return (maxQual - d[6]) * perHeight + mt;})
                        .attr("stroke","red");
  svg.selectAll("line.upcent").data(d).enter().append("line")
                        .attr("x1",function(d,i){return (i + 0.5) * boxWidth + ml;})
                        .attr("y1",function(d){return (maxQual - d[6]) * perHeight + mt;})
                        .attr("x2",function(d,i){return (i + 0.5) * boxWidth + ml;})
                        .attr("y2",function(d){return (maxQual - d[4]) * perHeight + mt;})
                        .attr("stroke","red")
                        .attr("stroke-dasharray","5,2");
  svg.selectAll("poly.mean").data(d).enter().append("polyline")
                        .attr("points",meanPloy.join(" "))
                        .attr("stroke","black")
                        .attr("fill","none");
}


