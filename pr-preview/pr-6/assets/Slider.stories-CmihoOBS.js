import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as c}from"./iframe-D13rUlhB.js";import{S as p}from"./Slider-Bo2kAj1Q.js";import{I as d}from"./Input-ZT-7J1CR.js";import{H as x,T as l}from"./Typography-Cmc6Gt2e.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./owner-CvMgaIeV.js";import"./useControlled-D18dhzFV.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useRenderElement-CbcSstyx.js";import"./useValueAsRef-BINbF6HZ.js";import"./useBaseUiId-C-sj7-By.js";import"./useValueChanged-Dd-7RhkP.js";import"./clamp-DyuOe9kr.js";import"./useCompositeListItem-D1kmGiIX.js";import"./LabelableContext-DU2AqePP.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./CSPContext-D2BQPVPk.js";import"./element-D2Kx1mQN.js";import"./detectBrowser-B_JuCNHz.js";import"./constants-CRqqCNE_.js";import"./useAnimationFrame-Cn-dUaus.js";import"./useOnMount-CaSRcZyW.js";import"./DirectionContext-BdY38WrA.js";import"./visuallyHidden-COI6QeQH.js";import"./formatNumber-E4R0_Sjy.js";import"./composite-DmhsLiSx.js";import"./useLabelableId-B5RE_ULw.js";import"./Input-2R42-Ccl.js";const X={title:"UI/Slider",component:p,argTypes:{onChange:{action:"changed"}}},v=a=>{const[r,m]=c.useState(Array.isArray(a.value)?a.value[0]:a.value??0);return e.jsxs("div",{className:"pb:space-y-2",children:[e.jsx("div",{className:"pb:w-80",children:e.jsx(p,{...a,value:r,onChange:s=>{const o=Array.isArray(s)?s[0]:s;m(o),a.onChange?.(s,null)}})}),e.jsxs(l,{variant:"small",className:"pb:text-slate-500",children:["Value: ",r]})]})},N=({args:a})=>{const[r,m]=c.useState(0),[s,o]=c.useState(100),[b,u]=c.useState(50);return e.jsxs("div",{className:"pb:space-y-4 pb:border pb:p-4 pb:rounded-lg pb:bg-white pb:shadow-sm",children:[e.jsx(p,{...a,min:r,max:s,value:b,onChange:t=>u(Array.isArray(t)?t[0]:t)}),e.jsxs("div",{className:"pb:flex pb:space-x-4",children:[e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-1",children:[e.jsx(l,{variant:"small",className:"pb:uppercase pb:text-slate-400 pb:font-bold pb:text-[10px]",children:"Min"}),e.jsx(d,{type:"number",value:r,onChange:t=>m(Number(t.target.value)),className:"pb:w-20"})]}),e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-1",children:[e.jsx(l,{variant:"small",className:"pb:uppercase pb:text-slate-400 pb:font-bold pb:text-[10px]",children:"Max"}),e.jsx(d,{type:"number",value:s,onChange:t=>o(Number(t.target.value)),className:"pb:w-20"})]}),e.jsx("div",{className:"pb:flex pb:flex-col pb:justify-end",children:e.jsxs(l,{variant:"small",className:"pb:text-slate-600 pb:font-medium",children:["Current: ",b]})})]})]})},n={args:{min:0,max:100,value:50},render:a=>e.jsx(v,{...a})},i={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-12 pb:p-4",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(x,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Width Responsiveness"}),e.jsxs("div",{className:"pb:space-y-6",children:[e.jsxs("div",{className:"pb:space-y-1",children:[e.jsx(l,{variant:"small",className:"pb:italic pb:text-black",children:"Full Width (Container Default)"}),e.jsx(p,{defaultValue:30})]}),e.jsxs("div",{className:"pb:space-y-1 pb:w-40",children:[e.jsx(l,{variant:"small",className:"pb:italic pb:text-black",children:"Narrow (w-40)"}),e.jsx(p,{defaultValue:70})]})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(x,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Dynamic Range Test"}),e.jsx(N,{args:{}})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    value: 50
  },
  render: args => <InteractiveSlider {...args} />
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Width Responsiveness
        </Heading>
        <div className="pb:space-y-6">
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:italic pb:text-black">
              Full Width (Container Default)
            </Text>
            <Slider defaultValue={30} />
          </div>
          <div className="pb:space-y-1 pb:w-40">
            <Text variant="small" className="pb:italic pb:text-black">
              Narrow (w-40)
            </Text>
            <Slider defaultValue={70} />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Dynamic Range Test
        </Heading>
        <RangeChangeableSlider args={{}} />
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};const Y=["Default","Variations"];export{n as Default,i as Variations,Y as __namedExportsOrder,X as default};
