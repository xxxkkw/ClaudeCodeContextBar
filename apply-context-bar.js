#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const projectRoot = __dirname;
const searchRoots = [
  path.join(os.homedir(), '.cursor', 'extensions'),
  path.join(os.homedir(), '.vscode', 'extensions'),
  path.join(os.homedir(), '.vscode-insiders', 'extensions'),
];

function versionOf(dir) {
  const match = path.basename(dir).match(/anthropic\.claude-code-(\d+\.\d+\.\d+)(?:-|$)/);
  return match ? match[1].split('.').map(Number) : [0, 0, 0];
}

function compareVersion(a, b) {
  const av = versionOf(a);
  const bv = versionOf(b);
  for (let i = 0; i < 3; i += 1) {
    if (av[i] !== bv[i]) return av[i] - bv[i];
  }
  return a.localeCompare(b);
}

function findLatestExtension() {
  const dirs = [];
  for (const base of searchRoots) {
    if (!fs.existsSync(base)) continue;
    for (const name of fs.readdirSync(base)) {
      if (!/^anthropic\.claude-code-\d+\.\d+\.\d+/.test(name)) continue;
      const full = path.join(base, name);
      if (fs.existsSync(path.join(full, 'webview', 'index.js')) && fs.existsSync(path.join(full, 'webview', 'index.css'))) {
        dirs.push(full);
      }
    }
  }
  dirs.sort(compareVersion);
  return dirs.at(-1);
}

function backup(extDir, relPath) {
  const src = path.join(extDir, relPath);
  const dst = path.join(projectRoot, 'backups', path.basename(extDir), relPath);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (!fs.existsSync(dst)) fs.copyFileSync(src, dst);
}

function updateJs(jsPath) {
  let js = fs.readFileSync(jsPath, 'utf8');

  const originalMap = 'var gW={usageContainer:"usageContainer_P2QnnQ",usage:"usage_P2QnnQ",pie:"pie_P2QnnQ",popup:"popup_P2QnnQ",popupContent:"popupContent_P2QnnQ",remainingText:"remainingText_P2QnnQ",compactHint:"compactHint_P2QnnQ"};';
  const barMap = 'var gW={usageContainer:"usageContainer_P2QnnQ",usage:"usage_P2QnnQ",pie:"pie_P2QnnQ",popup:"popup_P2QnnQ",popupContent:"popupContent_P2QnnQ",remainingText:"remainingText_P2QnnQ",compactHint:"compactHint_P2QnnQ",ccBarButton:"ccBarButton_P2QnnQ",ccBarTrack:"ccBarTrack_P2QnnQ",ccBarSegment:"ccBarSegment_P2QnnQ",ccBarText:"ccBarText_P2QnnQ"};';
  const detailMap = 'var gW={usageContainer:"usageContainer_P2QnnQ",usage:"usage_P2QnnQ",pie:"pie_P2QnnQ",popup:"popup_P2QnnQ",popupContent:"popupContent_P2QnnQ",remainingText:"remainingText_P2QnnQ",compactHint:"compactHint_P2QnnQ",ccBarButton:"ccBarButton_P2QnnQ",ccBarTrack:"ccBarTrack_P2QnnQ",ccBarSegment:"ccBarSegment_P2QnnQ",ccBarText:"ccBarText_P2QnnQ",ccDetailPopup:"ccDetailPopup_P2QnnQ",ccDetailPopupContent:"ccDetailPopupContent_P2QnnQ",ccDetailHeader:"ccDetailHeader_P2QnnQ",ccDetailTitle:"ccDetailTitle_P2QnnQ",ccDetailModel:"ccDetailModel_P2QnnQ",ccDetailTotal:"ccDetailTotal_P2QnnQ",ccDetailFullTrack:"ccDetailFullTrack_P2QnnQ",ccDetailFullSegment:"ccDetailFullSegment_P2QnnQ",ccDetailTable:"ccDetailTable_P2QnnQ",ccDetailTableHeader:"ccDetailTableHeader_P2QnnQ",ccDetailRow:"ccDetailRow_P2QnnQ",ccDetailName:"ccDetailName_P2QnnQ",ccDetailSwatch:"ccDetailSwatch_P2QnnQ",ccDetailTokens:"ccDetailTokens_P2QnnQ",ccDetailUsage:"ccDetailUsage_P2QnnQ",ccDetailBlock:"ccDetailBlock_P2QnnQ",ccDetailSectionTitle:"ccDetailSectionTitle_P2QnnQ",ccDetailHint:"ccDetailHint_P2QnnQ",ccDetailList:"ccDetailList_P2QnnQ",ccDetailItem:"ccDetailItem_P2QnnQ",ccDetailItemName:"ccDetailItemName_P2QnnQ",ccDetailItemTokens:"ccDetailItemTokens_P2QnnQ",ccDetailFallback:"ccDetailFallback_P2QnnQ"};';
  if (js.includes(originalMap)) js = js.replace(originalMap, detailMap);
  else if (js.includes(barMap)) js = js.replace(barMap, detailMap);
  else if (!js.includes('ccDetailPopup_P2QnnQ')) throw new Error('Could not find the context-usage class map in webview/index.js. The extension bundle format may have changed.');

  const callOld = 'o9.default.createElement(ft1,{usedTokens:$.usageData.value.totalTokens,contextWindow:$.usageData.value.contextWindow-$.usageData.value.maxOutputTokens-13000,onCompact:z,buttonClassName:o$.usageButtonV2})';
  const callNew = 'o9.default.createElement(ft1,{session:$,usedTokens:$.usageData.value.totalTokens,contextWindow:$.usageData.value.contextWindow-$.usageData.value.maxOutputTokens-13000,onCompact:z,buttonClassName:o$.usageButtonV2})';
  if (js.includes(callOld)) js = js.replace(callOld, callNew);
  else if (!js.includes(callNew)) throw new Error('Could not find the context-usage footer component call in webview/index.js. The extension bundle format may have changed.');

  const integratedFunction = 'function ft1({session:K,usedTokens:$,contextWindow:Z,onCompact:J,buttonClassName:Y}){let[X,Q]=SJ.useState(!1),G=SJ.useRef(null),[B,H]=SJ.useState(null);SJ.useEffect(()=>{if(X&&G.current){let A=G.current,P=A.getBoundingClientRect();if(P.left<0)A.style.left="0",A.style.right="auto";else if(P.right>window.innerWidth)A.style.left="auto",A.style.right="0"}},[X,B]);SJ.useEffect(()=>{let A=!1,P;async function _(){try{let M=await K?.getContextUsage?.();if(!A&&M?.usage)H(M.usage)}catch{}}if(K?.getContextUsage)return _(),P=setInterval(_,15000),()=>{A=!0;if(P)clearInterval(P)}},[K,K?.messages?.value?.length]);let q=Z>0?Math.min($/Z*100,100):0,z=uq1!==null?uq1:Number(B?.percentage??q),U=100-z;if(uq1===null&&Z===0&&!B)return null;let V=["var(--app-chart-1)","var(--app-chart-2)","var(--app-chart-3)","var(--app-chart-4)","var(--app-chart-5)","var(--app-chart-6)","var(--app-chart-7)","var(--app-chart-8)"],W=B?.rawMaxTokens??Z,T=B?.totalTokens??$,F=B?.categories?.filter((A)=>A.tokens>0&&!A.isDeferred)??null;if(F&&F.length>0&&!F.some((A)=>A.name==="Free space")&&W>T)F=[...F,{name:"Free space",tokens:W-T}];let C=F?.filter((A)=>A.name!=="Free space")??null,j=B?Xk(T)+" / "+Xk(W)+" tokens ("+Math.round(z)+"%) — hover for details, click to compact":Math.round(z)+"% context used — hover for details, click to compact";function R(A){if(!W)return"0%";let P=A/W*100;return P>0&&P<.1?"<0.1%":P.toFixed(1)+"%"}function L(A){if(!A)return"";let P=String(A).replace(/^\\/Users\\/[^/]+/,"~");return P.length>38?"…"+P.slice(-37):P}function D(A,P,_,M,E){return SJ.default.createElement("div",{className:gW.ccDetailRow,key:E},SJ.default.createElement("div",{className:gW.ccDetailName},M?SJ.default.createElement("span",{className:gW.ccDetailSwatch,style:{backgroundColor:M}}):null,A),SJ.default.createElement("div",{className:gW.ccDetailTokens},Xk(P)),SJ.default.createElement("div",{className:gW.ccDetailUsage},_))}function S(A,P,_,M){let E=(P??[]).filter((O)=>O?.tokens>0).sort((O,I)=>I.tokens-O.tokens).slice(0,5);return E.length?SJ.default.createElement("div",{className:gW.ccDetailBlock},SJ.default.createElement("div",{className:gW.ccDetailSectionTitle},A,_?SJ.default.createElement("span",{className:gW.ccDetailHint}," ",_):null),SJ.default.createElement("div",{className:gW.ccDetailList},E.map((O,I)=>SJ.default.createElement("div",{className:gW.ccDetailItem,key:I},SJ.default.createElement("span",{className:gW.ccDetailItemName},M(O)),SJ.default.createElement("span",{className:gW.ccDetailItemTokens},Xk(O.tokens)))))):null}function N(){return B?SJ.default.createElement(SJ.default.Fragment,null,SJ.default.createElement("div",{className:gW.ccDetailHeader},SJ.default.createElement("div",null,SJ.default.createElement("div",{className:gW.ccDetailTitle},"Context usage"),SJ.default.createElement("div",{className:gW.ccDetailModel},B.model??"")),SJ.default.createElement("div",{className:gW.ccDetailTotal},Xk(T)," / ",Xk(W)," tokens (",Math.round(z),"%)")),SJ.default.createElement("div",{className:gW.ccDetailFullTrack},C&&C.length>0?C.map((A,P)=>SJ.default.createElement("span",{key:P,className:gW.ccDetailFullSegment,style:{backgroundColor:V[P%V.length],width:(W>0?A.tokens/W*100:0)+"%"},title:A.name+": "+Xk(A.tokens)})):SJ.default.createElement("span",{className:gW.ccDetailFullSegment,style:{background:"linear-gradient(90deg,var(--app-chart-1),var(--app-chart-2),var(--app-chart-3))",width:Math.max(0,Math.min(100,z))+"%"}})),F&&F.length>0?SJ.default.createElement("div",{className:gW.ccDetailTable},SJ.default.createElement("div",{className:gW.ccDetailTableHeader},SJ.default.createElement("span",null,"Category"),SJ.default.createElement("span",null,"Tokens"),SJ.default.createElement("span",null,"Usage")),F.map((A,P)=>D(A.name,A.tokens,R(A.tokens),A.name==="Free space"?null:V[P%V.length],P))):null,S("Memory files",B.memoryFiles,"/memory",(A)=>L(A.path)),S("Custom agents",B.agents,null,(A)=>A.agentType??A.name??"Agent")):SJ.default.createElement("div",{className:gW.ccDetailFallback},SJ.default.createElement("div",{className:gW.remainingText},Math.round(U),"% of context remaining until auto-compact."),SJ.default.createElement("div",{className:gW.compactHint},"Click to compact now."))}return SJ.default.createElement("div",{className:gW.usageContainer,onMouseEnter:()=>Q(!0),onMouseLeave:()=>Q(!1)},SJ.default.createElement("button",{type:"button",className:gW.ccBarButton+" "+(Y??""),title:j,onClick:J},SJ.default.createElement("span",{className:gW.ccBarTrack},C&&C.length>0?C.map((A,P)=>SJ.default.createElement("span",{key:P,className:gW.ccBarSegment,style:{backgroundColor:V[P%V.length],width:(W>0?A.tokens/W*100:0)+"%"},title:A.name+": "+Xk(A.tokens)})):SJ.default.createElement("span",{className:gW.ccBarSegment,style:{background:"linear-gradient(90deg,var(--app-chart-1),var(--app-chart-2),var(--app-chart-3))",width:Math.max(0,Math.min(100,z))+"%"}})),SJ.default.createElement("span",{className:gW.ccBarText},Math.round(z),"%")),X&&SJ.default.createElement("div",{className:gW.popup+" "+gW.ccDetailPopup,ref:G},SJ.default.createElement("div",{className:gW.popupContent+" "+gW.ccDetailPopupContent},N())))}function ht1(';
  const originalFunctionRegex = /function ft1\(\{usedTokens:\$,contextWindow:Z,onCompact:J,buttonClassName:Y\}\)\{[\s\S]*?\}function ht1\(/;
  const integratedFunctionRegex = /function ft1\(\{session:K,usedTokens:\$,contextWindow:Z,onCompact:J,buttonClassName:Y\}\)\{[\s\S]*?\}function ht1\(/;
  if (integratedFunctionRegex.test(js)) js = js.replace(integratedFunctionRegex, integratedFunction);
  else if (originalFunctionRegex.test(js)) js = js.replace(originalFunctionRegex, integratedFunction);
  else throw new Error('Could not find the context-usage component body in webview/index.js. The extension bundle format may have changed.');

  fs.writeFileSync(jsPath, js);
}

function updateCss(cssPath) {
  let css = fs.readFileSync(cssPath, 'utf8');
  const marker = '/* claude-code-context-bar */';
  const legacyMarkerPrefix = '/* claude-code-context-bar-';
  const styleBlock = `${marker}.ccBarButton_P2QnnQ{display:inline-flex;align-items:center;justify-content:center;gap:6px;color:var(--app-primary-foreground);background:transparent;border:none;cursor:pointer}.ccBarButton_P2QnnQ:hover{background-color:var(--app-ghost-button-hover-background)}.ccBarTrack_P2QnnQ{display:flex;align-items:stretch;overflow:hidden;width:58px;height:6px;background:var(--app-input-border);border-radius:999px;box-shadow:inset 0 0 0 1px #ffffff1a}.ccBarSegment_P2QnnQ{display:block;height:100%;min-width:1px}.ccBarText_P2QnnQ{font-size:11px;font-weight:600;line-height:1;color:var(--app-primary-foreground);min-width:24px;text-align:right}.inputFooterV2_gGYT1w .usageButtonV2_gGYT1w.ccBarButton_P2QnnQ{box-sizing:border-box;width:94px;height:26px;padding:0 6px;border-radius:5px;gap:6px}.inputFooterV2_gGYT1w .usageButtonV2_gGYT1w.ccBarButton_P2QnnQ svg{width:auto;height:auto}.ccDetailPopup_P2QnnQ{width:390px;max-width:calc(100vw - 32px);pointer-events:auto}.popupContent_P2QnnQ.ccDetailPopupContent_P2QnnQ{display:flex;flex-direction:column;gap:12px;max-height:min(70vh,560px);overflow:auto;padding:14px 16px;color:var(--app-primary-foreground);font-size:13px;line-height:1.35;text-align:left}.ccDetailHeader_P2QnnQ{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.ccDetailTitle_P2QnnQ{font-size:15px;font-weight:700;line-height:1.2}.ccDetailModel_P2QnnQ{margin-top:6px;color:var(--app-secondary-foreground);font-size:13px;font-weight:600}.ccDetailTotal_P2QnnQ{color:var(--app-secondary-foreground);font-weight:700;white-space:nowrap}.ccDetailFullTrack_P2QnnQ{display:flex;align-items:stretch;overflow:hidden;width:100%;height:8px;background:var(--app-input-border);border-radius:999px}.ccDetailFullSegment_P2QnnQ{display:block;height:100%;min-width:1px}.ccDetailTable_P2QnnQ{display:flex;flex-direction:column;gap:7px}.ccDetailTableHeader_P2QnnQ,.ccDetailRow_P2QnnQ{display:grid;grid-template-columns:minmax(0,1fr) 68px 54px;gap:10px;align-items:center}.ccDetailTableHeader_P2QnnQ{padding-bottom:6px;border-bottom:1px solid var(--app-input-border);color:var(--app-secondary-foreground);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.ccDetailTableHeader_P2QnnQ span:nth-child(2),.ccDetailTableHeader_P2QnnQ span:nth-child(3){text-align:right}.ccDetailRow_P2QnnQ{min-height:20px;color:var(--app-primary-foreground);font-weight:600}.ccDetailName_P2QnnQ{display:flex;min-width:0;align-items:center;gap:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ccDetailSwatch_P2QnnQ{width:10px;height:10px;flex:0 0 auto;border-radius:3px}.ccDetailTokens_P2QnnQ,.ccDetailUsage_P2QnnQ{text-align:right;color:var(--app-secondary-foreground);font-variant-numeric:tabular-nums}.ccDetailBlock_P2QnnQ{display:flex;flex-direction:column;gap:7px}.ccDetailSectionTitle_P2QnnQ{color:var(--app-primary-foreground);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.ccDetailHint_P2QnnQ{color:var(--app-secondary-foreground);letter-spacing:0;text-transform:none}.ccDetailList_P2QnnQ{display:flex;flex-direction:column;gap:6px}.ccDetailItem_P2QnnQ{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center}.ccDetailItemName_P2QnnQ{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--app-primary-foreground);font-weight:600}.ccDetailItemTokens_P2QnnQ{color:var(--app-secondary-foreground);font-weight:600;font-variant-numeric:tabular-nums}.ccDetailFallback_P2QnnQ{display:flex;flex-direction:column;gap:6px}@media screen and (max-width:360px){.inputFooterV2_gGYT1w .usageButtonV2_gGYT1w.ccBarButton_P2QnnQ{width:70px;padding:0 4px;gap:4px}.ccBarTrack_P2QnnQ{width:36px}.ccBarText_P2QnnQ{font-size:10px;min-width:20px}.ccDetailPopup_P2QnnQ{width:320px}.ccDetailTableHeader_P2QnnQ,.ccDetailRow_P2QnnQ{grid-template-columns:minmax(0,1fr) 56px 46px;gap:8px}}`;
  const markerIndexes = [css.indexOf(marker), css.indexOf(legacyMarkerPrefix)].filter((index) => index >= 0);
  if (markerIndexes.length > 0) css = css.slice(0, Math.min(...markerIndexes));
  css += styleBlock;
  fs.writeFileSync(cssPath, css);
}

const extDir = process.argv[2] ? path.resolve(process.argv[2]) : findLatestExtension();
if (!extDir) {
  console.error('Claude Code extension not found. Checked:');
  for (const base of searchRoots) console.error(`- ${base}`);
  process.exit(1);
}

const jsPath = path.join(extDir, 'webview', 'index.js');
const cssPath = path.join(extDir, 'webview', 'index.css');
if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) {
  console.error(`Invalid extension directory: ${extDir}`);
  process.exit(1);
}

backup(extDir, path.join('webview', 'index.js'));
backup(extDir, path.join('webview', 'index.css'));
updateJs(jsPath);
updateCss(cssPath);
console.log(`Updated ${extDir}`);
