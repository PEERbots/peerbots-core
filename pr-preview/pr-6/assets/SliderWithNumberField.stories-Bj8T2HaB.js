import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as l}from"./SliderWithNumberField-DxxCm5SB.js";import{r as m}from"./iframe-D13rUlhB.js";import{H as n,T as p}from"./Typography-Cmc6Gt2e.js";import"./Slider-Bo2kAj1Q.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./owner-CvMgaIeV.js";import"./useControlled-D18dhzFV.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useRenderElement-CbcSstyx.js";import"./useValueAsRef-BINbF6HZ.js";import"./useBaseUiId-C-sj7-By.js";import"./useValueChanged-Dd-7RhkP.js";import"./clamp-DyuOe9kr.js";import"./useCompositeListItem-D1kmGiIX.js";import"./LabelableContext-DU2AqePP.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./CSPContext-D2BQPVPk.js";import"./element-D2Kx1mQN.js";import"./detectBrowser-B_JuCNHz.js";import"./constants-CRqqCNE_.js";import"./useAnimationFrame-Cn-dUaus.js";import"./useOnMount-CaSRcZyW.js";import"./DirectionContext-BdY38WrA.js";import"./visuallyHidden-COI6QeQH.js";import"./formatNumber-E4R0_Sjy.js";import"./composite-DmhsLiSx.js";import"./useLabelableId-B5RE_ULw.js";import"./NumberField-BCLQ4VmX.js";import"./Icon-DBJlkqnP.js";import"./useTimeout-DzBo7X4D.js";import"./useButton-D9tzRV-Q.js";import"./event-y5gTa7kU.js";import"./preload-helper-PPVm8Dsz.js";const M={title:"UI/SliderWithNumberField",component:l,argTypes:{onChange:{action:"changed"},min:{control:{type:"number"}},max:{control:{type:"number"}},step:{control:{type:"number"}},disabled:{control:"boolean"}}},r=a=>{const[o,d]=m.useState(a.value||a.defaultValue||0);return e.jsx(l,{...a,value:o,onChange:i=>{d(i),a.onChange?.(i,new Event("change"))}})},t={args:{min:0,max:100,defaultValue:50},render:a=>e.jsx("div",{className:"pb:w-80 pb:p-4",children:e.jsx(r,{...a})})},s={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-12 pb:p-4",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(n,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Responsive Layouts"}),e.jsxs("div",{className:"pb:space-y-8 pb:max-w-lg",children:[e.jsxs("div",{className:"pb:space-y-2",children:[e.jsx(p,{variant:"small",className:"pb:font-bold pb:underline",children:"Flexible (Full width of container)"}),e.jsx(r,{defaultValue:50})]}),e.jsxs("div",{className:"pb:space-y-2 pb:w-64 pb:border-l pb:border-r pb:border-dotted pb:px-2 pb:bg-gray-50 pb:py-4",children:[e.jsx(p,{variant:"small",className:"pb:font-bold pb:underline",children:"Narrow Container (w-64)"}),e.jsx(r,{defaultValue:50})]}),e.jsxs("div",{className:"pb:space-y-2 pb:w-48 pb:border-l pb:border-r pb:border-dotted pb:px-2 pb:bg-gray-50 pb:py-4",children:[e.jsx(p,{variant:"small",className:"pb:font-bold pb:underline",children:"Very Narrow (w-48) - Wraps"}),e.jsx(r,{defaultValue:50})]})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(n,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Configuration"}),e.jsx("div",{className:"pb:space-y-4 pb:max-w-sm",children:e.jsxs("div",{className:"pb:space-y-1",children:[e.jsx(p,{variant:"small",children:"Custom Step (0.5)"}),e.jsx(r,{step:.5,defaultValue:2.5,min:0,max:10})]})})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    defaultValue: 50
  },
  render: args => <div className="pb:w-80 pb:p-4">
      <InteractiveSliderWithNumberField {...args as React.ComponentProps<typeof SliderWithNumberField>} />
    </div>
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Responsive Layouts
        </Heading>
        <div className="pb:space-y-8 pb:max-w-lg">
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:font-bold pb:underline">
              Flexible (Full width of container)
            </Text>
            <InteractiveSliderWithNumberField defaultValue={50} />
          </div>

          <div className="pb:space-y-2 pb:w-64 pb:border-l pb:border-r pb:border-dotted pb:px-2 pb:bg-gray-50 pb:py-4">
            <Text variant="small" className="pb:font-bold pb:underline">
              Narrow Container (w-64)
            </Text>
            <InteractiveSliderWithNumberField defaultValue={50} />
          </div>

          <div className="pb:space-y-2 pb:w-48 pb:border-l pb:border-r pb:border-dotted pb:px-2 pb:bg-gray-50 pb:py-4">
            <Text variant="small" className="pb:font-bold pb:underline">
              Very Narrow (w-48) - Wraps
            </Text>
            <InteractiveSliderWithNumberField defaultValue={50} />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Configuration
        </Heading>
        <div className="pb:space-y-4 pb:max-w-sm">
          <div className="pb:space-y-1">
            <Text variant="small">Custom Step (0.5)</Text>
            <InteractiveSliderWithNumberField step={0.5} defaultValue={2.5} min={0} max={10} />
          </div>
        </div>
      </div>
    </div>
}`,...s.parameters?.docs?.source}}};const Q=["Default","Variations"];export{t as Default,s as Variations,Q as __namedExportsOrder,M as default};
