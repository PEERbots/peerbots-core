import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as t}from"./SettingsPanel-CinWh_6Z.js";import{B as l}from"./Button-bHTpVbF1.js";import{C as p}from"./Checkbox-BD5OBAah.js";import{T as a,H as n}from"./Typography-Cmc6Gt2e.js";import{L as r}from"./Label-A2YRJ0Jk.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Collapsible-Xv3vPTNk.js";import"./iframe-D13rUlhB.js";import"./preload-helper-PPVm8Dsz.js";import"./Icon-DBJlkqnP.js";import"./useButton-D9tzRV-Q.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useRenderElement-CbcSstyx.js";import"./useControlled-D18dhzFV.js";import"./visuallyHidden-COI6QeQH.js";import"./LabelableContext-DU2AqePP.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./useBaseUiId-C-sj7-By.js";import"./useAriaLabelledBy-CMAIAX4y.js";import"./useValueChanged-Dd-7RhkP.js";import"./useOpenChangeComplete-BCUGvzLt.js";import"./useAnimationFrame-Cn-dUaus.js";import"./useOnMount-CaSRcZyW.js";import"./Tooltip-dSEDCyU0.js";import"./useTimeout-DzBo7X4D.js";import"./event-y5gTa7kU.js";import"./detectBrowser-B_JuCNHz.js";import"./useOnFirstRender-CtD386ZA.js";import"./owner-CvMgaIeV.js";import"./element-D2Kx1mQN.js";import"./constants-CRqqCNE_.js";import"./index-CbzWsoC_.js";import"./useSyncedFloatingRootContext-CcBzBcFp.js";import"./useValueAsRef-BINbF6HZ.js";import"./getDisabledMountTransitionStyles-DcnzfQve.js";import"./floating-ui.utils-BPjIC1MX.js";import"./DirectionContext-BdY38WrA.js";const W={title:"UI/SettingsPanel",component:t,tags:["autodocs"],argTypes:{}},s={args:{title:"Account Settings",children:e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(a,{children:"This is the content of the settings panel."}),e.jsxs("div",{className:"pb:flex pb:gap-2",children:[e.jsx(l,{variant:"primary",children:"Save Changes"}),e.jsx(l,{variant:"secondary",children:"Cancel"})]})]})}},i={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:max-w-2xl pb:bg-gray-50",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(n,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Default"}),e.jsx(t,{title:"Notification Settings",children:e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(a,{children:"Manage how you receive notifications."}),e.jsxs("div",{className:"pb:flex pb:items-center pb:gap-2 pb:p-2 pb:rounded pb:bg-white",children:[e.jsx(p,{id:"email-notif"}),e.jsx(r,{htmlFor:"email-notif",className:"pb:text-sm",children:"Email Notifications"})]})]})})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(n,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"No Title"}),e.jsx(t,{children:e.jsx(a,{className:"pb:italic",children:"Panel without a title rendered as a simple container."})})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(n,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Collapsible States"}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(t,{title:"Collapsible (Default Open)",collapsible:!0,children:e.jsx(a,{children:"This panel can be toggled and starts open."})}),e.jsx(t,{title:"Collapsible (Default Closed)",collapsible:!0,defaultOpen:!1,children:e.jsx(a,{children:"This panel starts closed to save space."})})]})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Account Settings",
    children: <div className="pb:space-y-4">
        <Text>This is the content of the settings panel.</Text>
        <div className="pb:flex pb:gap-2">
          <Button variant="primary">Save Changes</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </div>
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:max-w-2xl pb:bg-gray-50">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Default
        </Heading>
        <SettingsPanel title="Notification Settings">
          <div className="pb:space-y-4">
            <Text>Manage how you receive notifications.</Text>
            <div className="pb:flex pb:items-center pb:gap-2 pb:p-2 pb:rounded pb:bg-white">
              <Checkbox id="email-notif" />
              <Label htmlFor="email-notif" className="pb:text-sm">
                Email Notifications
              </Label>
            </div>
          </div>
        </SettingsPanel>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          No Title
        </Heading>
        <SettingsPanel>
          <Text className="pb:italic">
            Panel without a title rendered as a simple container.
          </Text>
        </SettingsPanel>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Collapsible States
        </Heading>
        <div className="pb:space-y-4">
          <SettingsPanel title="Collapsible (Default Open)" collapsible={true}>
            <Text>This panel can be toggled and starts open.</Text>
          </SettingsPanel>
          <SettingsPanel title="Collapsible (Default Closed)" collapsible={true} defaultOpen={false}>
            <Text>This panel starts closed to save space.</Text>
          </SettingsPanel>
        </div>
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};const X=["Default","Variations"];export{s as Default,i as Variations,X as __namedExportsOrder,W as default};
