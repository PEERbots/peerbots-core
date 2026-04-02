import{j as a}from"./jsx-runtime-u17CrQMm.js";import{T as c}from"./TabRadio-DYuB9kqe.js";import{r as b}from"./iframe-D13rUlhB.js";import{I as l}from"./Icon-DBJlkqnP.js";import{H as r,T as o}from"./Typography-Cmc6Gt2e.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useRenderElement-CbcSstyx.js";import"./useControlled-D18dhzFV.js";import"./useCompositeListItem-D1kmGiIX.js";import"./composite-DmhsLiSx.js";import"./composite-BH_q_e9x.js";import"./floating-ui.utils-BPjIC1MX.js";import"./event-y5gTa7kU.js";import"./detectBrowser-B_JuCNHz.js";import"./constants-CRqqCNE_.js";import"./useButton-D9tzRV-Q.js";import"./DirectionContext-BdY38WrA.js";import"./ToolbarRootContext-Bn6ej6kI.js";import"./useBaseUiId-C-sj7-By.js";import"./preload-helper-PPVm8Dsz.js";const w={title:"UI/TabRadio",component:c,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","primary","danger"]},onChange:{action:"changed"}}},s=e=>{const[m,d]=b.useState(e.value);return a.jsx(c,{...e,value:m,onChange:p=>{d(p),e.onChange?.(p)}})},n=[{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"},{value:"monthly",label:"Monthly"}],i={args:{options:n,value:"daily",onChange:()=>{}},render:e=>a.jsx(s,{...e})},t={args:{options:n,value:"daily",onChange:()=>{}},render:()=>a.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:min-w-[400px]",children:[a.jsxs("div",{className:"pb:space-y-4",children:[a.jsx(r,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Variants"}),a.jsxs("div",{className:"pb:space-y-6",children:[a.jsxs("div",{className:"pb:space-y-2",children:[a.jsx(o,{variant:"small",className:"pb:italic",children:"Default"}),a.jsx(s,{options:n,value:"daily",variant:"default",onChange:()=>{}})]}),a.jsxs("div",{className:"pb:space-y-2",children:[a.jsx(o,{variant:"small",className:"pb:italic",children:"Primary"}),a.jsx(s,{options:n,value:"daily",variant:"primary",onChange:()=>{}})]}),a.jsxs("div",{className:"pb:space-y-2",children:[a.jsx(o,{variant:"small",className:"pb:italic",children:"Danger"}),a.jsx(s,{options:n,value:"daily",variant:"danger",onChange:()=>{}})]})]})]}),a.jsxs("div",{className:"pb:space-y-4",children:[a.jsx(r,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"With Icons"}),a.jsx(s,{value:"Message",onChange:()=>{},options:[{value:"Message",label:a.jsxs("div",{className:"pb:flex pb:items-center pb:gap-1",children:[a.jsx(l,{size:"sm",className:"pb:w-4 pb:h-4",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"})}),"Message"]})},{value:"Log",label:a.jsxs("div",{className:"pb:flex pb:items-center pb:gap-1",children:[a.jsx(l,{size:"sm",className:"pb:w-4 pb:h-4",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"})}),"Log"]})}]})]})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    options: textOptions as readonly TabRadioOption<string>[],
    value: "daily",
    onChange: () => {}
  },
  render: args => <TabRadioWithState {...args} />
}`,...i.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    options: textOptions as readonly TabRadioOption<string>[],
    value: "daily",
    onChange: () => {}
  },
  render: () => <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:min-w-[400px]">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Variants
        </Heading>
        <div className="pb:space-y-6">
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:italic">
              Default
            </Text>
            <TabRadioWithState options={textOptions as readonly TabRadioOption<string>[]} value="daily" variant="default" onChange={() => {}} />
          </div>
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:italic">
              Primary
            </Text>
            <TabRadioWithState options={textOptions as readonly TabRadioOption<string>[]} value="daily" variant="primary" onChange={() => {}} />
          </div>
          <div className="pb:space-y-2">
            <Text variant="small" className="pb:italic">
              Danger
            </Text>
            <TabRadioWithState options={textOptions as readonly TabRadioOption<string>[]} value="daily" variant="danger" onChange={() => {}} />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          With Icons
        </Heading>
        <TabRadioWithState value="Message" onChange={() => {}} options={[{
        value: "Message",
        label: <div className="pb:flex pb:items-center pb:gap-1">
                    <Icon size="sm" className="pb:w-4 pb:h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </Icon>
                    Message
                  </div>
      }, {
        value: "Log",
        label: <div className="pb:flex pb:items-center pb:gap-1">
                    <Icon size="sm" className="pb:w-4 pb:h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </Icon>
                    Log
                  </div>
      }] as const} />
      </div>
    </div>
}`,...t.parameters?.docs?.source}}};const D=["Default","Variations"];export{i as Default,t as Variations,D as __namedExportsOrder,w as default};
