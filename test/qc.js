//var drawQCdistribution = function(title, data){
//   var div = document.createElement("div");
//   div.innerHTML("Test for quality distribution");
//   document.body.appendChild(div);
//}

//drawQCdistribution("QC distribution",data);

$(document).ready(function(){
  $("#testIt").click(function(){
    drawQualPerPos("#qualPerPos",data[1].data,1838,400,10,10,10,10,2,2);
    drawAveQualPerSeq("#aveQualPerSeq",data[3].data,600,400,10,10,10,10);    
    drawbasePerPos("#basePerPos",data[4].data,1800,400,10,10,10,10);    
  }); 
  $("#stext").click(function(){
    var txt = $("#inputText").val();
    var stxt = txt.split("\n");
    var i = 0;
    var j = 0;
    var eachStu;
    for(i = 1; i < stxt.length; i++){
      eachStu = stxt[i].split("\t");
      var totalScore = 0;
      for(j = 1; j < eachStu.length; j++){
        totalScore += parseFloat(eachStu[j]); 
      } 
      stxt[i] = [eachStu[0],totalScore];
    }
    console.log(stxt);
  });
})

// w, h: svg width and height
// mt,mr,mb,ml: margin top, margin right, margin bottom, margin left
// mil, mil: margin left of box, margin right of box
// d = [base,mean,median,lq,uq,10q,90q]
var drawQualPerPos = function(appendTo, d, w, h, mt,mr,mb,ml,mil,mir){
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
                        .attr("fill","blue");

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

//appendTo: the element svg append to
// w, h: svg width and height
// mt,mr,mb,ml: margin top, margin right, margin bottom, margin left
// d = [[quality_value,count],[quality_value,count]]
// Here need to presented in multiple type
var drawAveQualPerSeq = function(appendTo, d, w, h, mt,mr,mb,ml){
   var svg = d3.select(appendTo).append("svg").attr("width",w)
                                              .attr("height",h)
                                              .attr("id","QualPerlSeq")
                                              .attr("background-color","#dddddd")
   var axisH = 50;
   var axisY = 50;
   var axisYpad = 10;
   var maxQual = 45;
   var innerW = w - ml - mr - axisY ;
   var innerH = h - mt - mb - axisH;
   var boxWidth = innerW/d.length;
   var perHeight = innerH / maxQual;
   var numOfYticks = 10;
   var numOfXticks = 10;
   
   var qualRange = [d[0][0],d[0][0]];
   var freqRange = [d[0][1],d[0][1]];
   var i = 0;
   var j = 0;
   
   var xTicks = [];
   xTicks[0] = d[0][0];
   for(i = 1; i < d.length; i++){
     if(d[i][0] < qualRange[0]) qualRange[0] = d[i][0]; 
     if(d[i][0] > qualRange[1]) qualRange[1] = d[i][0]; 
     if(d[i][1] < freqRange[0]) freqRange[0] = d[i][1]; 
     if(d[i][1] > freqRange[1]) freqRange[1] = d[i][1]; 
     xTicks[i] = d[i][0];
   }
   
   var Xscalar = d3.scale.linear().domain(qualRange).range([0,innerW]);
   svg.append("g").attr("class","axis")
                 .attr("transform","translate(" + (ml+ axisY) + "," + (h-mb-axisH) + ")")
                 .call(d3.svg.axis().scale(Xscalar).orient("bottom").tickValues(xTicks))
                 .selectAll("text")
                 .attr("x",function(d,i){return 20;})
                 .attr("y",0)
                 .attr("dy",".35em")
                 .attr("transform", "rotate(90)");

   var yTicks = [];
   var tickUnit = (freqRange[1] - freqRange[0])/numOfYticks; 
   var torder = 1;
   if(tickUnit > 1 ){   
     while(tickUnit / 10 > 10) {
       torder *= 10;
       tickUnit /= 10;
     } 
     tickUnit = Math.round(tickUnit);
     tickUnit *= torder;
   }else{
     while(tickUnit * 10 < 10) {
       tickUnit *= 10;
       torder *= 10;
     }
     tickUnit = Math.round(tickUnit);
     tickUnit /= torder;
   }

   yTicks[0] = freqRange[0] - tickUnit/10;
   i = 0;
   while(yTicks[i] < freqRange[1]){
     i++;
     yTicks[i] = yTicks[i-1] + tickUnit;
   }  
   var Yscalar = d3.scale.linear().domain([d3.min(yTicks),d3.max(yTicks)]).range([innerH,0]);
   svg.append("g").attr("class","axis")
                 .attr("transform","translate(" + (ml + axisY - axisYpad) + "," + mt + ")")
                 .call(d3.svg.axis().scale(Yscalar).orient("left").tickValues(yTicks));
    

   var polyLines = [];
   j = 0;
   for(i = 0; i < d.length; i++){
     polyLines[j++] = Xscalar(d[i][0]);
     polyLines[j++] = Yscalar(d[i][1]);
   }
   svg.append("polyline")
      .attr("transform","translate(" + (ml + axisY) + "," + mt + ")")
      .attr("points",polyLines.join(" "))
      .attr("stroke","black")
      .attr("fill","none");
}

//appendTo: the element svg append to
// w, h: svg width and height
// mt,mr,mb,ml: margin top, margin right, margin bottom, margin left
// d = [[base,G%,A%,T%,C%],...]
// Here need to presented in multiple type
drawbasePerPos = function(appendTo, d, w, h, mt,mr,mb,ml){
   var svg = d3.select(appendTo).append("svg").attr("width",w)
                                              .attr("height",h)
                                              .attr("id","QualPerlSeq")
                                              .attr("background-color","#dddddd")
   var axisH = 50;
   var axisY = 50;
   var axisYpad = 10;
   var maxQual = 45;
   var innerW = w - ml - mr - axisY ;
   var innerH = h - mt - mb - axisH;
   var boxWidth = innerW/d.length;
   var perHeight = innerH / maxQual;
   
   var xTicks = [];
   var i = 0;
   for(i = 0; i < d.length; i++){
     xTicks[i] = i + 1;
   }

   var Xscalar = d3.scale.linear().domain([1,d.length]).range([0,innerW]);
   svg.append("g").attr("class","axis")
                 .attr("transform","translate(" + (ml+ axisY) + "," + (h-mb-axisH) + ")")
                 .call(d3.svg.axis().scale(Xscalar).orient("bottom").tickValues(xTicks))
                 .selectAll("text")
                 .attr("x",function(d,i){return 20;})
                 .attr("y",0)
                 .attr("dy",".35em")
                 .attr("transform", "rotate(90)");

   var Yscalar = d3.scale.linear().domain([0,100]).range([innerH,0]);
   var yTicks = [0,10,20,30,40,50,60,70,80,90,100];
   svg.append("g").attr("class","axis")
                 .attr("transform","translate(" + (ml + axisY - axisYpad) + "," + mt + ")")
                 .call(d3.svg.axis().scale(Yscalar).orient("left").tickValues(yTicks));
   var j = 0;
   var polyLines = [];
   for(i = 1 ; i < d[0].length; i++){
     polyLines[i-1] = [];
   }
   var k = 0;
   for(i = 0; i < d.length; i++){
     for(j = 1; j < d[i].length; j++){
       polyLines[j-1][k] = Xscalar(d[i][0]);
       polyLines[j-1][k + 1] = Yscalar(d[i][j]);
     }
     k += 2;
   }
   svg.append("polyline")
      .attr("transform","translate(" + (ml + axisY) + "," + mt + ")")
      .attr("points",polyLines[0].join(" "))
      .attr("stroke","black")
      .attr("fill","none");
   svg.append("polyline")
      .attr("transform","translate(" + (ml + axisY) + "," + mt + ")")
      .attr("points",polyLines[1].join(" "))
      .attr("stroke","red")
      .attr("fill","none");
   svg.append("polyline")
      .attr("transform","translate(" + (ml + axisY) + "," + mt + ")")
      .attr("points",polyLines[2].join(" "))
      .attr("stroke","green")
      .attr("fill","none");
   svg.append("polyline")
      .attr("transform","translate(" + (ml + axisY) + "," + mt + ")")
      .attr("points",polyLines[3].join(" "))
      .attr("stroke","blue")
      .attr("fill","none");
}
  
