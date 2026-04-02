import{j as a}from"./jsx-runtime-u17CrQMm.js";import{a as D,V as _,b as p,B as j,c as W,g as B,d as T,e as L,m as R,f as S,w as v,h as w,i as h,j as E,k as g,l as q}from"./victory-line-lJtj-8c3.js";import{R as o}from"./iframe-D13rUlhB.js";import"./preload-helper-PPVm8Dsz.js";const x={width:450,height:300,padding:50},N=[{x:1,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4}];class u extends o.Component{static animationWhitelist=["data","domain","height","padding","style","width"];static displayName="VictoryBar";static role="bar";static defaultTransitions={onLoad:{duration:2e3,before:()=>({_y:0,_y1:0,_y0:0}),after:t=>({_y:t._y,_y1:t._y1,_y0:t._y0})},onExit:{duration:500,before:()=>({_y:0,yOffset:0})},onEnter:{duration:500,before:()=>({_y:0,_y1:0,_y0:0}),after:t=>({_y:t._y,_y1:t._y1,_y0:t._y0})}};static defaultProps={containerComponent:o.createElement(W,null),data:N,dataComponent:o.createElement(j,null),groupComponent:o.createElement("g",{role:"presentation"}),labelComponent:o.createElement(p,null),samples:50,sortOrder:"ascending",standalone:!0,theme:_.grayscale};static getDomain=B;static getData=T;static getBaseProps(t){return L(t,x)}static expectedComponents=["dataComponent","labelComponent","groupComponent","containerComponent"];static shouldRenderDatum=()=>!0;shouldAnimate(){return!!this.props.animate}render(){const{animationWhitelist:t,role:d}=C,n=R(this.props,x,d);if(this.shouldAnimate())return this.animateComponent(n,t);let r;n.groupComponent?.type===S?r=this.renderData(n,u.shouldRenderDatum):r=this.renderData(n);const s=n.standalone?this.renderContainer(n.containerComponent,r):r;return v(s,n)}}const C=D(u);function k({data:i,alt:t,chartWidth:d=600,chartHeight:n=400,average:r,referenceLineValue:s,referenceLineLabel:V="Reference",label:f}){const m=Math.max(...i.map(e=>e.count),5),b=i.map(e=>e.label);return i.length===0?null:a.jsxs("div",{className:"pb:mb-6",role:"img","aria-label":t,children:[f&&a.jsx("label",{className:"pb:text-xs pb:uppercase pb:font-bold pb:text-gray-400 pb:block pb:mb-2 pb:px-1",children:f}),a.jsxs(w,{width:d,height:n,padding:{left:100,right:50,top:40,bottom:60},containerComponent:a.jsx(q,{}),children:[a.jsx(h,{horizontal:!0,tickValues:b,style:{axis:{stroke:"#cbd5e1"},tickLabels:{fontSize:18,padding:5,fill:"#334155"}}}),a.jsx(h,{dependentAxis:!0,domain:[0,m],tickFormat:e=>typeof e=="number"?Math.round(e):e,style:{axis:{stroke:"#cbd5e1"},tickLabels:{fontSize:18,padding:5,fill:"#334155"},grid:{stroke:"#f1f5f9"}}}),a.jsx(C,{horizontal:!0,domain:{x:[.5,b.length+.5],y:[0,m]},data:i,x:"label",y:"count",labels:({datum:e})=>{if(!e||e.count===0)return"";if(!e.items||e.items.length===0)return`${e.count}`;let y=e.items.slice(0,5).join(`
`);return e.items.length>5&&(y+=`
...and ${e.items.length-5} more`),y},labelComponent:a.jsx(E,{style:{fontSize:18},flyoutStyle:{fill:"white",stroke:"#cbd5e1"},pointerLength:5,cornerRadius:2,constrainToVisibleArea:!0}),style:{data:{fill:({datum:e})=>e?.fill?e.fill==="White"?"#f3f4f6":e.fill:"#46d9d9",width:14,stroke:({datum:e})=>e?.stroke?e.stroke:e?.fill==="White"?"#d1d5db":"none",strokeWidth:({datum:e})=>e?.stroke||e?.fill==="White"?.5:0,cursor:"pointer"}},cornerRadius:2}),r!==void 0&&a.jsx(g,{y:()=>r,style:{data:{stroke:"#9ca3af",strokeWidth:2,strokeDasharray:"4, 4"}},labels:["Average"],labelComponent:a.jsx(p,{y:45,style:{fill:"#475569",fontSize:18,fontWeight:"bold"},backgroundStyle:{fill:"white"},backgroundPadding:12})}),s!==void 0&&a.jsx(g,{y:()=>s,labels:[V],labelComponent:a.jsx(p,{y:45,style:{fill:"#ef4444",fontSize:18,fontWeight:"bold"},backgroundStyle:{fill:"white"},backgroundPadding:12}),style:{data:{stroke:"#ef4444",strokeWidth:2,strokeDasharray:"4, 4"}}})]})]})}k.__docgenInfo={description:"",methods:[],displayName:"DistributionBarChart",props:{data:{required:!0,tsType:{name:"Array",elements:[{name:"DistributionBarData"}],raw:"DistributionBarData[]"},description:""},alt:{required:!0,tsType:{name:"string"},description:""},chartWidth:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"600",computed:!1}},chartHeight:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"400",computed:!1}},average:{required:!1,tsType:{name:"number"},description:""},referenceLineValue:{required:!1,tsType:{name:"number"},description:""},referenceLineLabel:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Reference"',computed:!1}},label:{required:!1,tsType:{name:"string"},description:""}}};const O={title:"Charts/DistributionBarChart",component:k,parameters:{layout:"padded"}},l={args:{alt:"Default emotion distribution bar chart.",data:[{label:"Happy",count:12,items:["Hello!","How are you?"]},{label:"Sad",count:3,items:["I am sad."]},{label:"Neutral",count:20,items:["Okay.","Yes.","No."]}],average:11,referenceLineValue:15,referenceLineLabel:"Target",label:"Emotion"}},c={args:{alt:"Color variation bar chart.",data:[{label:"Red",count:15,fill:"Red"},{label:"Blue",count:8,fill:"Blue"},{label:"White",count:5,fill:"White"},{label:"Custom",count:10,fill:"#ff00ff",stroke:"#000"}],label:"Color Variations"}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    alt: "Default emotion distribution bar chart.",
    data: [{
      label: "Happy",
      count: 12,
      items: ["Hello!", "How are you?"]
    }, {
      label: "Sad",
      count: 3,
      items: ["I am sad."]
    }, {
      label: "Neutral",
      count: 20,
      items: ["Okay.", "Yes.", "No."]
    }],
    average: 11,
    referenceLineValue: 15,
    referenceLineLabel: "Target",
    label: "Emotion"
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    alt: "Color variation bar chart.",
    data: [{
      label: "Red",
      count: 15,
      fill: "Red"
    }, {
      label: "Blue",
      count: 8,
      fill: "Blue"
    }, {
      label: "White",
      count: 5,
      fill: "White"
    }, {
      label: "Custom",
      count: 10,
      fill: "#ff00ff",
      stroke: "#000"
    }],
    label: "Color Variations"
  }
}`,...c.parameters?.docs?.source}}};const M=["Default","Variations"];export{l as Default,c as Variations,M as __namedExportsOrder,O as default};
