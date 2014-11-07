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
    drawBox("#Quality",data[1].data,1838,400,10,10,10,10,2,2);
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
   var axisY = 50;
   var axisYpad = 10;
   var maxQual = 45;
   var innerW = w - ml - mr - axisY ;
   var innerH = h - mt - mb - axisH;
   var boxWidth = innerW/d.length;
   var perHeight = innerH / maxQual;
   
   
   var fontsize = 30;
   
   var i = 0;
   var j = 0;
   var meanPloy = [];//left,middle,right
   var tickValues = []
   
   for(i=0;i<d.length;i++){
     meanPloy[j++] = (i + 0.5) * boxWidth + ml + axisY;
     meanPloy[j++] = (maxQual - d[i][1]) * perHeight + mt; 
     tickValues[i] = i + 0.5;
   }
   
   j = 0; 
   var YticksValue = [];
   for(i=0; i < maxQual; i += 10){
     YticksValue[j++] = i; 
   }
   YticksValue[j] = maxQual

   var Xscalar = d3.scale.linear().domain([0,d.length]).range([0,innerW])
   
   svg.append("g").attr("class","axis")
                 .attr("transform","translate(" + (ml+ axisY) + "," + (h-mb-axisH) + ")")
                 .call(d3.svg.axis().scale(Xscalar).orient("bottom").tickValues(tickValues))
                 .selectAll("text")
                 .attr("x",function(d,i){return 20;})
                 .attr("y",0)
                 .attr("dy",".35em")
                 .attr("transform", "rotate(90)");
   var Yscalar = d3.scale.linear().domain([0,maxQual]).range([innerH,0]);
   svg.append("g").attr("class","axis")
                 .attr("transform","translate(" + (ml + axisY - axisYpad) + "," + mt + ")")
                 .call(d3.svg.axis().scale(Yscalar).orient("left").tickValues(YticksValue));
   svg.selectAll("rect.up").data(d).enter().append("rect")
                        .attr("x",function(d,i){return i * boxWidth + mil + ml + axisY;})
                        .attr("y",mt)
                        .attr("width", boxWidth)
                        .attr("height", (maxQual - 30) * perHeight)
                        .attr("fill",function(d,i){ return i % 2 == 0 ? d3.rgb(245,245,245) : d3.rgb(0,245,245);});

   svg.selectAll("rect.mid").data(d).enter().append("rect")
                        .attr("x",function(d,i){return i * boxWidth + mil + ml + axisY;})
                        .attr("y",mt + (maxQual - 30) * perHeight )
                        .attr("width", boxWidth)
                        .attr("height", 10 * perHeight)
                        .attr("fill",function(d,i){ return i % 2 == 0 ? d3.rgb(205,205,205) : d3.rgb(0,205,205);});

   svg.selectAll("rect.mid").data(d).enter().append("rect")
                        .attr("x",function(d,i){return i * boxWidth + mil + ml + axisY;})
                        .attr("y",mt + (maxQual - 20) * perHeight )
                        .attr("width", boxWidth)
                        .attr("height", 20 * perHeight)
                        .attr("fill",function(d,i){ return i % 2 == 0 ? d3.rgb(185,185,185) : d3.rgb(0,185,185);});
   
   svg.selectAll("rect.box").data(d).enter().append("rect")
                        .attr("x",function(d,i){return i * boxWidth + mil + ml + axisY;})
                        .attr("y",function(d,i){return (maxQual - d[4]) * perHeight + mt;})
                        .attr("width",boxWidth - mil - mir)
                        .attr("height",function(d){return (d[4] - d[3]) * perHeight;})
                        .attr("stroke",d3.rgb(0,0,0))
                        .attr("stroke-width",1)
                        .attr("fill","none");

   svg.selectAll("line.Median").data(d).enter().append("line")
                        .attr("x1",function(d,i){return i * boxWidth + mil + ml + axisY;})
                        .attr("y1",function(d){return (maxQual - d[2]) * perHeight + mt;})
                        .attr("x2",function(d,i){return (i+1) * boxWidth - mir + ml + axisY;})
                        .attr("y2",function(d){return (maxQual - d[2]) * perHeight + mt;})
                        .attr("stroke","green");
   svg.selectAll("line.dw").data(d).enter().append("line")
                        .attr("x1",function(d,i){return i * boxWidth + mil + ml + axisY;})
                        .attr("y1",function(d){return (maxQual - d[5]) * perHeight + mt;})
                        .attr("x2",function(d,i){return (i+1) * boxWidth - mir + ml + axisY;})
                        .attr("y2",function(d){return (maxQual - d[5]) * perHeight + mt;})
                        .attr("stroke","red");
   svg.selectAll("line.dwcent").data(d).enter().append("line")
                        .attr("x1",function(d,i){return (i + 0.5) * boxWidth + ml + axisY;})
                        .attr("y1",function(d){return (maxQual - d[5]) * perHeight + mt;})
                        .attr("x2",function(d,i){return (i + 0.5) * boxWidth + ml + axisY;})
                        .attr("y2",function(d){return (maxQual - d[3]) * perHeight + mt;})
                        .attr("stroke","red")
                        .attr("stroke-dasharray","5,2");
   
   svg.selectAll("line.up").data(d).enter().append("line")
                        .attr("x1",function(d,i){return i * boxWidth + mil + ml + axisY;})
                        .attr("y1",function(d){return (maxQual - d[6]) * perHeight + mt;})
                        .attr("x2",function(d,i){return (i+1) * boxWidth - mir + ml + axisY;})
                        .attr("y2",function(d){return (maxQual - d[6]) * perHeight + mt;})
                        .attr("stroke","red");
   svg.selectAll("line.upcent").data(d).enter().append("line")
                        .attr("x1",function(d,i){return (i + 0.5) * boxWidth + ml + axisY;})
                        .attr("y1",function(d){return (maxQual - d[6]) * perHeight + mt;})
                        .attr("x2",function(d,i){return (i + 0.5) * boxWidth + ml + axisY;})
                        .attr("y2",function(d){return (maxQual - d[4]) * perHeight + mt;})
                        .attr("stroke","red")
                        .attr("stroke-dasharray","5,2");
   svg.append("polyline")
                        .attr("points",meanPloy.join(" "))
                        .attr("stroke","black")
                        .attr("fill","none");
}


