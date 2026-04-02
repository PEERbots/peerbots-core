import{j as o}from"./jsx-runtime-u17CrQMm.js";import{a as r}from"./Alert-B8xCjE9s.js";import{r as m}from"./iframe-D13rUlhB.js";import"./Button-bHTpVbF1.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./useButton-D9tzRV-Q.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useRenderElement-CbcSstyx.js";import"./Input-ZT-7J1CR.js";import"./Input-2R42-Ccl.js";import"./useControlled-D18dhzFV.js";import"./owner-CvMgaIeV.js";import"./LabelableContext-DU2AqePP.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./useLabelableId-B5RE_ULw.js";import"./useBaseUiId-C-sj7-By.js";import"./element-D2Kx1mQN.js";import"./detectBrowser-B_JuCNHz.js";import"./constants-CRqqCNE_.js";import"./Select-Nl3GrG_V.js";import"./Icon-DBJlkqnP.js";import"./visuallyHidden-COI6QeQH.js";import"./useOnFirstRender-CtD386ZA.js";import"./useTimeout-DzBo7X4D.js";import"./useOnMount-CaSRcZyW.js";import"./event-y5gTa7kU.js";import"./index-CbzWsoC_.js";import"./useOpenChangeComplete-BCUGvzLt.js";import"./useAnimationFrame-Cn-dUaus.js";import"./useValueAsRef-BINbF6HZ.js";import"./useValueChanged-Dd-7RhkP.js";import"./InternalBackdrop-DEciqa4c.js";import"./composite-BH_q_e9x.js";import"./floating-ui.utils-BPjIC1MX.js";import"./getDisabledMountTransitionStyles-DcnzfQve.js";import"./DirectionContext-BdY38WrA.js";import"./CSPContext-D2BQPVPk.js";import"./useCompositeListItem-D1kmGiIX.js";import"./ToolbarRootContext-Bn6ej6kI.js";import"./composite-DmhsLiSx.js";import"./clamp-DyuOe9kr.js";import"./Typography-Cmc6Gt2e.js";import"./Slider-Bo2kAj1Q.js";import"./formatNumber-E4R0_Sjy.js";import"./SliderWithNumberField-DxxCm5SB.js";import"./NumberField-BCLQ4VmX.js";import"./Tooltip-dSEDCyU0.js";import"./useSyncedFloatingRootContext-CcBzBcFp.js";import"./Dialog-C6joqWRh.js";import"./Separator-mvHYTzdr.js";import"./Collapsible-Xv3vPTNk.js";import"./Switch-mZBy1sYr.js";import"./useAriaLabelledBy-CMAIAX4y.js";import"./Label-A2YRJ0Jk.js";import"./TabRadio-DYuB9kqe.js";import"./Field-C7W8ui3f.js";import"./Anchor-DlxWK1YP.js";import"./TextArea-CRq6Ceee.js";import"./Checkbox-BD5OBAah.js";import"./SettingsPanel-CinWh_6Z.js";import"./Skeleton-ClvtQIYx.js";import"./preload-helper-PPVm8Dsz.js";const yo={title:"UI/AuthFormUI",component:r,parameters:{layout:"centered"}},i={render:function(){const[t,n]=m.useState("signing in");return o.jsx("div",{className:"pb:w-[400px]",children:o.jsx(r,{mode:t,onModeChange:n,formAction:async()=>{await new Promise(s=>setTimeout(s,1e3))},actionState:{error:"",message:""},onGoogleSignIn:()=>alert("Google Sign In clicked"),description:"Sign in to simplify connecting to robots, and synchronize your work across devices."})})}},e={render:()=>o.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-10 pb:w-[400px]",children:[o.jsx(r,{mode:"signing up",onModeChange:()=>{},formAction:async()=>{},actionState:{error:"",message:""},onGoogleSignIn:()=>{},description:"Sign up description"}),o.jsx(r,{mode:"resetting password",onModeChange:()=>{},formAction:async()=>{},actionState:{error:"",message:"Email sent!"}}),o.jsx(r,{mode:"signing in",onModeChange:()=>{},formAction:async()=>{},actionState:{error:"Invalid email or password",message:""},description:"Sign in description"})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: function Render() {
    const [mode, setMode] = useState<"signing up" | "signing in" | "resetting password">("signing in");
    return <div className="pb:w-[400px]">
        <AuthFormUI mode={mode} onModeChange={setMode} formAction={async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }} actionState={{
        error: "",
        message: ""
      }} onGoogleSignIn={() => alert("Google Sign In clicked")} description="Sign in to simplify connecting to robots, and synchronize your work across devices." />
      </div>;
  }
}`,...i.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => {
    return <div className="pb:flex pb:flex-col pb:gap-10 pb:w-[400px]">
        <AuthFormUI mode="signing up" onModeChange={() => {}} formAction={async () => {}} actionState={{
        error: "",
        message: ""
      }} onGoogleSignIn={() => {}} description="Sign up description" />
        <AuthFormUI mode="resetting password" onModeChange={() => {}} formAction={async () => {}} actionState={{
        error: "",
        message: "Email sent!"
      }} />
        <AuthFormUI mode="signing in" onModeChange={() => {}} formAction={async () => {}} actionState={{
        error: "Invalid email or password",
        message: ""
      }} description="Sign in description" />
      </div>;
  }
}`,...e.parameters?.docs?.source}}};const Io=["Default","Variations"];export{i as Default,e as Variations,Io as __namedExportsOrder,yo as default};
