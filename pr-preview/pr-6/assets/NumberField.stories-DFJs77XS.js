import{j as e}from"./jsx-runtime-u17CrQMm.js";import{N as a}from"./NumberField-BCLQ4VmX.js";import{r as o}from"./iframe-D13rUlhB.js";import{H as p,T as r}from"./Typography-Cmc6Gt2e.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Icon-DBJlkqnP.js";import"./useControlled-D18dhzFV.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useRenderElement-CbcSstyx.js";import"./useTimeout-DzBo7X4D.js";import"./useOnMount-CaSRcZyW.js";import"./useValueAsRef-BINbF6HZ.js";import"./visuallyHidden-COI6QeQH.js";import"./owner-CvMgaIeV.js";import"./detectBrowser-B_JuCNHz.js";import"./LabelableContext-DU2AqePP.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./useLabelableId-B5RE_ULw.js";import"./useBaseUiId-C-sj7-By.js";import"./formatNumber-E4R0_Sjy.js";import"./clamp-DyuOe9kr.js";import"./useButton-D9tzRV-Q.js";import"./useValueChanged-Dd-7RhkP.js";import"./event-y5gTa7kU.js";import"./preload-helper-PPVm8Dsz.js";const R={title:"UI/NumberField",component:a,tags:["autodocs"],argTypes:{disabled:{control:"boolean"},showButtons:{control:"boolean"}}},s={args:{placeholder:"Enter a number...",min:0,max:100}},c=l=>{const[n,i]=o.useState(l.defaultValue??10);return e.jsxs("div",{className:"pb:space-y-2",children:[e.jsx("div",{className:"pb:max-w-[200px]",children:e.jsx(a,{...l,value:n,onChange:m=>i(m)})}),e.jsxs(r,{variant:"small",children:["Value: ",n]})]})},t={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-12 pb:p-4",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(p,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Configuration"}),e.jsxs("div",{className:"pb:grid pb:gap-8",children:[e.jsxs("div",{className:"pb:space-y-2",children:[e.jsx(r,{variant:"small",className:"pb:font-bold",children:"With Buttons & Large Step"}),e.jsx(a,{showButtons:!0,defaultValue:50,step:10})]}),e.jsxs("div",{className:"pb:space-y-2",children:[e.jsx(r,{variant:"small",className:"pb:font-bold",children:"Small Step (0.1) & Limits (0-1)"}),e.jsx(a,{showButtons:!0,defaultValue:.5,step:.1,min:0,max:1})]}),e.jsxs("div",{className:"pb:space-y-2",children:[e.jsx(r,{variant:"small",className:"pb:font-bold",children:"Disabled"}),e.jsx(a,{disabled:!0,defaultValue:123})]})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(p,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Interactive State"}),e.jsx(c,{showButtons:!0})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter a number...",
    min: 0,
    max: 100
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Configuration
        </Heading>
        <div className="pb:grid pb:gap-8">
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:font-bold">
              With Buttons & Large Step
            </Text>
            <NumberField showButtons defaultValue={50} step={10} />
          </div>
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:font-bold">
              Small Step (0.1) & Limits (0-1)
            </Text>
            <NumberField showButtons defaultValue={0.5} step={0.1} min={0} max={1} />
          </div>
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:font-bold">
              Disabled
            </Text>
            <NumberField disabled defaultValue={123} />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Interactive State
        </Heading>
        <InteractiveExample showButtons={true} />
      </div>
    </div>
}`,...t.parameters?.docs?.source}}};const U=["Default","Variations"];export{s as Default,t as Variations,U as __namedExportsOrder,R as default};
