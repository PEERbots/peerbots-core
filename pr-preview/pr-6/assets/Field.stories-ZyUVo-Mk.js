import{j as e}from"./jsx-runtime-u17CrQMm.js";import{F as l}from"./Field-C7W8ui3f.js";import{I as p}from"./Icon-DBJlkqnP.js";import{H as a}from"./Typography-Cmc6Gt2e.js";import{I as t}from"./Input-ZT-7J1CR.js";import{S as o}from"./Slider-Bo2kAj1Q.js";import{S as d}from"./Select-Nl3GrG_V.js";import{S as c}from"./Switch-mZBy1sYr.js";import{N as n}from"./NumberField-BCLQ4VmX.js";import{S as b}from"./SliderWithNumberField-DxxCm5SB.js";import{C as s}from"./Checkbox-BD5OBAah.js";import"./iframe-D13rUlhB.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Label-A2YRJ0Jk.js";import"./Tooltip-dSEDCyU0.js";import"./useTimeout-DzBo7X4D.js";import"./useRenderElement-CbcSstyx.js";import"./useOnMount-CaSRcZyW.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./event-y5gTa7kU.js";import"./detectBrowser-B_JuCNHz.js";import"./useBaseUiId-C-sj7-By.js";import"./useOnFirstRender-CtD386ZA.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./visuallyHidden-COI6QeQH.js";import"./owner-CvMgaIeV.js";import"./element-D2Kx1mQN.js";import"./constants-CRqqCNE_.js";import"./index-CbzWsoC_.js";import"./useOpenChangeComplete-BCUGvzLt.js";import"./useAnimationFrame-Cn-dUaus.js";import"./useSyncedFloatingRootContext-CcBzBcFp.js";import"./useValueAsRef-BINbF6HZ.js";import"./getDisabledMountTransitionStyles-DcnzfQve.js";import"./floating-ui.utils-BPjIC1MX.js";import"./DirectionContext-BdY38WrA.js";import"./LabelableContext-DU2AqePP.js";import"./Input-2R42-Ccl.js";import"./useControlled-D18dhzFV.js";import"./useLabelableId-B5RE_ULw.js";import"./useValueChanged-Dd-7RhkP.js";import"./clamp-DyuOe9kr.js";import"./useCompositeListItem-D1kmGiIX.js";import"./CSPContext-D2BQPVPk.js";import"./formatNumber-E4R0_Sjy.js";import"./composite-DmhsLiSx.js";import"./InternalBackdrop-DEciqa4c.js";import"./composite-BH_q_e9x.js";import"./useButton-D9tzRV-Q.js";import"./ToolbarRootContext-Bn6ej6kI.js";import"./useAriaLabelledBy-CMAIAX4y.js";const me={title:"UI/Field",component:l,tags:["autodocs"],argTypes:{label:{control:"text"},description:{control:"text"},error:{control:"text"},tooltip:{control:"text"}}},i={args:{label:"Email Address",description:"We'll never share your email.",tooltip:"Enter your primary email address",children:e.jsx(t,{placeholder:"you@example.com"})}},r={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:max-w-2xl",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(a,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider",children:"Basic Inputs"}),e.jsxs("div",{className:"pb:grid pb:gap-6",children:[e.jsx(l,{label:"Text Input",description:"Standard text field",tooltip:"Helping text",children:e.jsx(t,{placeholder:"Enter something..."})}),e.jsx(l,{label:"Password",error:"Password is too weak",children:e.jsx(t,{type:"password",defaultValue:"123"})}),e.jsx(l,{label:"Number Field",children:e.jsx(n,{showButtons:!0,defaultValue:10})})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(a,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider",children:"Selection & Toggles"}),e.jsxs("div",{className:"pb:grid pb:gap-6",children:[e.jsx(l,{label:"Select Language",children:e.jsx(d,{options:[{label:"English",value:"en"},{label:"Spanish",value:"es"},{label:"French",value:"fr"}],placeholder:"Choose a language"})}),e.jsx(l,{label:"Enable Notifications",className:"pb:flex-row pb:items-center pb:justify-between",children:e.jsx(c,{})}),e.jsx(l,{label:"Enable automation",labelPlacement:"right",labelWeight:"normal",children:e.jsx(s,{id:"automation"})})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(a,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider",children:"Sliders"}),e.jsxs("div",{className:"pb:grid pb:gap-6",children:[e.jsx(l,{label:"Simple Slider",tooltip:"Adjust volume",children:e.jsx(o,{defaultValue:50})}),e.jsx(l,{label:"Sensitivity",children:e.jsx(b,{min:0,max:10,step:.1,defaultValue:5})})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(a,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider",children:"Layout Variations"}),e.jsxs("div",{className:"pb:grid pb:gap-6",children:[e.jsx(l,{label:"Label on Left",labelPlacement:"left",description:"Label to the left",children:e.jsx(t,{placeholder:"Enter text..."})}),e.jsx(l,{label:"Label on Right",labelPlacement:"right",description:"Label to the right",children:e.jsx(t,{placeholder:"Enter text..."})}),e.jsx(l,{label:"With Search Icon",icon:e.jsx(p,{name:"search"}),children:e.jsx(t,{placeholder:"Search..."})})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(a,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider",children:"Field Groups"}),e.jsxs("div",{className:"pb:border pb:rounded-lg pb:p-6 pb:bg-gray-50/50",children:[e.jsx(a,{level:5,className:"pb:font-bold pb:mb-4",children:"Settings Group"}),e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-4",children:[e.jsx(l,{label:"Break up long sentences",labelPlacement:"right",labelWeight:"normal",description:"Ensures buttons don't have too much text",children:e.jsx(s,{id:"group-opt-1"})}),e.jsx(l,{label:"Detect emotions",labelPlacement:"right",labelWeight:"normal",error:"Requires active connection",children:e.jsx(s,{id:"group-opt-2"})})]})]})]})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Email Address",
    description: "We'll never share your email.",
    tooltip: "Enter your primary email address",
    children: <Input placeholder="you@example.com" />
  }
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:max-w-2xl">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider">
          Basic Inputs
        </Heading>
        <div className="pb:grid pb:gap-6">
          <Field label="Text Input" description="Standard text field" tooltip="Helping text">
            <Input placeholder="Enter something..." />
          </Field>
          <Field label="Password" error="Password is too weak">
            <Input type="password" defaultValue="123" />
          </Field>
          <Field label="Number Field">
            <NumberField showButtons defaultValue={10} />
          </Field>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider">
          Selection & Toggles
        </Heading>
        <div className="pb:grid pb:gap-6">
          <Field label="Select Language">
            <Select options={[{
            label: "English",
            value: "en"
          }, {
            label: "Spanish",
            value: "es"
          }, {
            label: "French",
            value: "fr"
          }]} placeholder="Choose a language" />
          </Field>
          <Field label="Enable Notifications" className="pb:flex-row pb:items-center pb:justify-between">
            <Switch />
          </Field>
          <Field label="Enable automation" labelPlacement="right" labelWeight="normal">
            <Checkbox id="automation" />
          </Field>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider">
          Sliders
        </Heading>
        <div className="pb:grid pb:gap-6">
          <Field label="Simple Slider" tooltip="Adjust volume">
            <Slider defaultValue={50} />
          </Field>
          <Field label="Sensitivity">
            <SliderWithNumberField min={0} max={10} step={0.1} defaultValue={5} />
          </Field>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider">
          Layout Variations
        </Heading>
        <div className="pb:grid pb:gap-6">
          <Field label="Label on Left" labelPlacement="left" description="Label to the left">
            <Input placeholder="Enter text..." />
          </Field>
          <Field label="Label on Right" labelPlacement="right" description="Label to the right">
            <Input placeholder="Enter text..." />
          </Field>
          <Field label="With Search Icon" icon={<Icon name="search" />}>
            <Input placeholder="Search..." />
          </Field>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase pb:tracking-wider">
          Field Groups
        </Heading>
        <div className="pb:border pb:rounded-lg pb:p-6 pb:bg-gray-50/50">
          <Heading level={5} className="pb:font-bold pb:mb-4">
            Settings Group
          </Heading>
          <div className="pb:flex pb:flex-col pb:gap-4">
            <Field label="Break up long sentences" labelPlacement="right" labelWeight="normal" description="Ensures buttons don't have too much text">
              <Checkbox id="group-opt-1" />
            </Field>
            <Field label="Detect emotions" labelPlacement="right" labelWeight="normal" error="Requires active connection">
              <Checkbox id="group-opt-2" />
            </Field>
          </div>
        </div>
      </div>
    </div>
}`,...r.parameters?.docs?.source}}};const ue=["Default","Variations"];export{i as Default,r as Variations,ue as __namedExportsOrder,me as default};
