import { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  Package, ChevronLeft, ChevronRight, Plus, Trash2, Edit, Printer,
  Upload, X, ZoomIn, ZoomOut, Search, Layers, Tag, Check, GripVertical
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   FIREBASE INTEGRATION — 아래 주석 해제 후 config 입력하여 실시간 연동
   ═══════════════════════════════════════════════════════════════════
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc,
         updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 실시간 배송 데이터 훅
function useFirestoreDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'deliveries'), snap => {
      setDeliveries(snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order||0) - (b.order||0)));
    });
    return unsub;
  }, []);
  const add = (data) => addDoc(collection(db, 'deliveries'), data);
  const update = (id, data) => updateDoc(doc(db, 'deliveries', id), data);
  const remove = (id) => deleteDoc(doc(db, 'deliveries', id));
  const reorder = async (ordered) => {
    const batch = writeBatch(db);
    ordered.forEach((d, i) => batch.update(doc(db, 'deliveries', d.id), { order: i+1 }));
    await batch.commit();
  };
  return { deliveries, add, update, remove, reorder };
}
*/

const genId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

const DELIVERIES_INIT = [
  { id: genId(), order:1, deliveryDate:"2026-04-17", store:"이케아 고양점",   customerName:"김민준", phone:"010-1234-5678", address:"경기도 고양시 일산동구 중산로 123", color:"오크 브라운", items:"소파 3인용 ×1, 쿠션 ×4",            notes:"현관까지만",        rowColor:"#0d2744", status:"pending"    },
  { id: genId(), order:2, deliveryDate:"2026-04-17", store:"한샘몰",          customerName:"이서연", phone:"010-9876-5432", address:"서울시 마포구 합정동 456번지",      color:"화이트",     items:"식탁 4인용 ×1, 의자 ×4",              notes:"2층 엘베 없음",     rowColor:"#0d2a1a", status:"completed"  },
  { id: genId(), order:3, deliveryDate:"2026-04-18", store:"현대리바트",       customerName:"박지호", phone:"010-5555-7777", address:"인천시 남동구 구월동 789",          color:"그레이",     items:"침대 퀸 ×1, 협탁 ×2",                 notes:"",                  rowColor:"#2a1010", status:"inprogress" },
  { id: genId(), order:4, deliveryDate:"2026-04-20", store:"일룸",            customerName:"최수아", phone:"010-2222-3333", address:"경기도 파주시 운정동 321",          color:"네이비",     items:"책상 ×1, 책장 ×1, 의자 ×1",           notes:"오후 2시 이후",     rowColor:"#1a1030", status:"pending"    },
  { id: genId(), order:5, deliveryDate:"2026-04-22", store:"에이스침대",       customerName:"정하준", phone:"010-8888-9999", address:"서울시 강남구 역삼동 888",          color:"베이지",     items:"침대 슈퍼싱글 ×1, 매트리스 ×1",       notes:"포장 보존 요청",   rowColor:"#1e293b", status:"pending"    },
  { id: genId(), order:6, deliveryDate:"2026-04-25", store:"까사미아",         customerName:"윤지은", phone:"010-3333-4444", address:"경기도 수원시 팔달구 인계동 77",    color:"라이트 그레이", items:"3단 서랍장 ×2, 거울 ×1",             notes:"",                  rowColor:"#1e293b", status:"pending"    },
];

const ITEMS_INIT = [
  { id: genId(), name:"소파 3인용",      color:"오크 브라운",     barcode:"SF001-OB", stock:5  },
  { id: genId(), name:"소파 3인용",      color:"화이트",          barcode:"SF001-WH", stock:3  },
  { id: genId(), name:"식탁 4인용",      color:"오크",            barcode:"DT004-OA", stock:8  },
  { id: genId(), name:"의자",            color:"블랙",            barcode:"CH001-BK", stock:20 },
  { id: genId(), name:"침대 퀸",         color:"그레이",          barcode:"BD-Q-GR",  stock:4  },
  { id: genId(), name:"협탁",            color:"화이트",          barcode:"NT001-WH", stock:12 },
  { id: genId(), name:"책상",            color:"네이비",          barcode:"DS001-NV", stock:6  },
  { id: genId(), name:"책장",            color:"네이비",          barcode:"BS001-NV", stock:4  },
  { id: genId(), name:"3단 서랍장",      color:"라이트 그레이",   barcode:"DR003-LG", stock:7  },
  { id: genId(), name:"매트리스 슈퍼싱글",color:"화이트",         barcode:"MT-SS-WH", stock:5  },
];

const SETS_INIT = [
  { id: genId(), name:"모듈 식탁 세트",   barcode:"SET-DT004", notes:"4인 식탁 + 의자 세트", components:[{ name:"식탁 4인용", color:"오크", qty:1 },{ name:"의자", color:"블랙", qty:4 }] },
  { id: genId(), name:"침실 풀 세트",     barcode:"SET-BD-Q",  notes:"퀸 침대 + 협탁 2개",   components:[{ name:"침대 퀸", color:"그레이", qty:1 },{ name:"협탁", color:"화이트", qty:2 }] },
  { id: genId(), name:"홈오피스 세트",    barcode:"SET-HO001", notes:"책상 + 책장 + 의자",    components:[{ name:"책상", color:"네이비", qty:1 },{ name:"책장", color:"네이비", qty:1 },{ name:"의자", color:"블랙", qty:1 }] },
];

const C = {
  bg:      "#0a0f1e",
  card:    "#111827",
  card2:   "#1a2235",
  border:  "#1f2f47",
  border2: "#2a3d56",
  text:    "#e8edf5",
  muted:   "#5a7090",
  muted2:  "#7a90a8",
  accent:  "#f0a020",
  accent2: "#fbbf24",
  blue:    "#3b82f6",
  green:   "#22c55e",
  red:     "#ef4444",
  indigo:  "#6366f1",
};

const AppCtx = createContext(null);

function Barcode({ value = "SAMPLE", h = 50, showText = true }) {
  const bars = [];
  let x = 6;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    for (let b = 7; b >= 0; b--) {
      const wide = (code >> b) & 1;
      const w = wide ? 2.8 : 1.2;
      if (wide || i % 2 === 0) {
        bars.push(<rect key={`${i}${b}`} x={x} y={2} width={wide ? 2.8 : 0.9} height={h - (showText ? 15 : 4)} fill="#111" />);
      }
      x += w + 0.4;
    }
    x += 2;
  }
  const tw = x + 6;
  return (
    <svg width={tw} height={h} style={{ background: "#fff", display: "block", borderRadius: 2 }}>
      <rect width={tw} height={h} fill="#fff" />
      {bars}
      {showText && (
        <text x={tw / 2} y={h - 3} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#333">{value}</text>
      )}
    </svg>
  );
}

function CalendarSidebar({ selectedDate, onSelect, deliveries }) {
  const [view, setView] = useState(new Date(2026, 3, 1));
  const y = view.getFullYear(), mo = view.getMonth();
  const firstDay = new Date(y, mo, 1).getDay();
  const totalDays = new Date(y, mo + 1, 0).getDate();
  const dateSet = new Set(deliveries.map(d => d.deliveryDate));
  const DAY = ["일","월","화","수","목","금","토"];
  const cells = [...Array(firstDay).fill(null), ...Array.from({length:totalDays},(_,i)=>i+1)];
  const fmt = d => `${y}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const thisMonth = `${y}-${String(mo+1).padStart(2,"0")}`;
  const monthTotal = deliveries.filter(d => d.deliveryDate.startsWith(thisMonth)).length;
  const statusCount = (s) => deliveries.filter(d => d.deliveryDate.startsWith(thisMonth) && d.status===s).length;

  return (
    <div style={{ width:230, flexShrink:0, background:C.card, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", padding:12 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <button onClick={()=>setView(new Date(y,mo-1,1))} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", padding:4, borderRadius:4, display:"flex" }}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ color:C.text, fontSize:14, fontWeight:700 }}>{y}년 {mo+1}월</span>
        <button onClick={()=>setView(new Date(y,mo+1,1))} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", padding:4, borderRadius:4, display:"flex" }}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:6 }}>
        {DAY.map((l,i) => (
          <div key={l} style={{ textAlign:"center", fontSize:10, color:i===0?"#f87171":i===6?"#93c5fd":C.muted, padding:"2px 0" }}>{l}</div>
        ))}
        {cells.map((d,i) => {
          if (!d) return <div key={`e${i}`} />;
          const ds = fmt(d);
          const hasDel = dateSet.has(ds);
          const isSel = selectedDate === ds;
          const delCount = deliveries.filter(del => del.deliveryDate===ds).length;
          const dow = (firstDay + d - 1) % 7;
          return (
            <button key={d} onClick={()=>onSelect(isSel ? null : ds)} style={{
              background: isSel ? C.accent : hasDel ? C.border : "transparent",
              border: `2px solid ${isSel ? C.accent : hasDel ? C.accent+"55" : "transparent"}`,
              borderRadius:5, color:isSel?"#000":dow===0?"#f87171":dow===6?"#93c5fd":C.text,
              cursor:"pointer", fontSize:11, padding:"3px 0", position:"relative", fontWeight:hasDel?700:400, lineHeight:"1.5"
            }}>
              {d}
              {hasDel && (
                <span style={{ position:"absolute", bottom:1, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:"50%", background:isSel?"#000":C.accent, display:"block" }} />
              )}
            </button>
          );
        })}
      </div>

      <button onClick={()=>onSelect(null)} style={{ background:C.border2, color:C.muted2, border:"none", borderRadius:5, padding:"5px 0", cursor:"pointer", fontSize:11, marginBottom:12 }}>
        전체 보기
      </button>

      <div style={{ background:C.bg, borderRadius:10, padding:14, flex:1 }}>
        <div style={{ color:C.muted, fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>이번 달</div>
        <div style={{ color:C.accent, fontSize:28, fontWeight:800, lineHeight:1 }}>{monthTotal}<span style={{ color:C.muted, fontSize:13, fontWeight:400 }}> 건</span></div>
        <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:6 }}>
          {[["대기",C.accent,"pending"],["배송중",C.blue,"inprogress"],["완료",C.green,"completed"]].map(([label,color,key]) => {
            const cnt = statusCount(key);
            return cnt > 0 ? (
              <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.muted2 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:color, display:"inline-block" }} />{label}
                </span>
                <span style={{ color, fontWeight:700, fontSize:12 }}>{cnt}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

function DeliveryModal({ onClose, onSave, init }) {
  const blankForm = { deliveryDate:new Date().toISOString().split("T")[0], store:"", customerName:"", phone:"", address:"", color:"", items:"", notes:"", rowColor:"#1e293b", status:"pending" };
  const [f, setF] = useState(init || blankForm);
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const ROW_COLORS = ["#1e293b","#0d2744","#0d2a1a","#2a1010","#1a1030","#2a2010"];
  const IS = { width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:6, color:C.text, padding:"8px 10px", fontSize:13, boxSizing:"border-box", outline:"none" };
  const LS = { color:C.muted2, fontSize:11, display:"block", marginBottom:4 };

  return (
    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.card2, borderRadius:14, width:560, maxHeight:"88vh", overflow:"auto", border:`1px solid ${C.border2}` }}>
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:C.card2, zIndex:1 }}>
          <h2 style={{ color:C.text, fontSize:16, fontWeight:700, margin:0 }}>{init?"✏️ 배송 수정":"📦 배송 일정 추가"}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", padding:4 }}><X size={18} /></button>
        </div>
        <div style={{ padding:22, display:"grid", gap:13 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={LS}>배송일 *</label><input type="date" value={f.deliveryDate} onChange={e=>s("deliveryDate",e.target.value)} style={IS} /></div>
            <div><label style={LS}>구입처</label><input type="text" value={f.store} onChange={e=>s("store",e.target.value)} placeholder="이케아 고양점" style={IS} /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={LS}>고객명 *</label><input type="text" value={f.customerName} onChange={e=>s("customerName",e.target.value)} placeholder="홍길동" style={IS} /></div>
            <div><label style={LS}>연락처</label><input type="text" value={f.phone} onChange={e=>s("phone",e.target.value)} placeholder="010-0000-0000" style={IS} /></div>
          </div>
          <div><label style={LS}>주소</label><input type="text" value={f.address} onChange={e=>s("address",e.target.value)} placeholder="배송지 주소" style={IS} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div><label style={LS}>색상</label><input type="text" value={f.color} onChange={e=>s("color",e.target.value)} placeholder="오크 브라운" style={IS} /></div>
            <div><label style={LS}>상태</label>
              <select value={f.status} onChange={e=>s("status",e.target.value)} style={IS}>
                <option value="pending">대기중</option>
                <option value="inprogress">배송중</option>
                <option value="completed">완료</option>
              </select>
            </div>
          </div>
          <div><label style={LS}>주문 품목 (수량 포함)</label><textarea value={f.items} onChange={e=>s("items",e.target.value)} placeholder="소파 3인용 ×1, 쿠션 ×4" rows={2} style={{...IS,resize:"vertical"}} /></div>
          <div><label style={LS}>기타 메모</label><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} placeholder="특이사항" rows={2} style={{...IS,resize:"vertical"}} /></div>
          <div>
            <label style={LS}>행 배경색</label>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              {ROW_COLORS.map(c=>(
                <button key={c} onClick={()=>s("rowColor",c)} style={{ width:30, height:30, borderRadius:5, background:c, border:f.rowColor===c?`3px solid ${C.accent}`:`2px solid ${C.border2}`, cursor:"pointer" }} />
              ))}
              <input type="color" value={f.rowColor} onChange={e=>s("rowColor",e.target.value)} style={{ width:30, height:30, borderRadius:5, border:`2px solid ${C.border2}`, cursor:"pointer", padding:2, background:C.bg }} />
            </div>
          </div>
        </div>
        <div style={{ padding:"14px 22px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, justifyContent:"flex-end", position:"sticky", bottom:0, background:C.card2 }}>
          <button onClick={onClose} style={{ padding:"9px 18px", background:C.border2, color:C.muted2, border:"none", borderRadius:7, cursor:"pointer", fontSize:13 }}>취소</button>
          <button onClick={()=>{ if(!f.customerName||!f.deliveryDate) return; onSave(f); }} style={{ padding:"9px 18px", background:C.accent, color:"#000", border:"none", borderRadius:7, cursor:"pointer", fontWeight:700, fontSize:13 }}>
            {init?"수정 완료":"추가"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PrintLabelModal({ d, onClose }) {
  const labelRef = useRef();
  const print = () => {
    const html = labelRef.current.innerHTML;
    const w = window.open("","_blank","width=470,height=400");
    w.document.write(`<!DOCTYPE html><html><head><title>배송 라벨 — ${d.customerName}</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 20px; font-family: 'Malgun Gothic', sans-serif; background: #fff; color: #000; }
  .lb { border: 2px solid #000; padding: 16px; max-width: 400px; }
  .hd { font-size: 15px; font-weight: 800; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px; }
  .row { display: flex; margin: 3px 0; font-size: 12px; }
  .k { width: 65px; color: #666; flex-shrink: 0; }
  .bc { margin-top: 12px; display: flex; flex-direction: column; align-items: center; }
  svg { display: block; }
</style></head><body>${html}</body></html>`);
    w.document.close();
    setTimeout(()=>w.print(), 600);
  };

  const rows = [["배송일",d.deliveryDate],["구입처",d.store],["고객명",d.customerName],["연락처",d.phone],["주소",d.address],["품목",d.items],["색상",d.color],["메모",d.notes]].filter(([,v])=>v);

  return (
    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.card2, borderRadius:14, width:500, border:`1px solid ${C.border2}` }}>
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h2 style={{ color:C.text, fontSize:15, fontWeight:700, margin:0 }}>🖨 송장 / 라벨 미리보기</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer" }}><X size={18} /></button>
        </div>
        <div style={{ padding:"18px 22px" }}>
          <div ref={labelRef} className="lb" style={{ background:"#fff", border:"2px solid #000", padding:16, borderRadius:4, color:"#000" }}>
            <div className="hd" style={{ fontSize:15, fontWeight:800, borderBottom:"2px solid #000", paddingBottom:8, marginBottom:10 }}>📦 가구 배송 라벨</div>
            {rows.map(([k,v])=>(
              <div key={k} className="row" style={{ display:"flex", marginBottom:3, fontSize:12 }}>
                <span className="k" style={{ width:65, color:"#666", flexShrink:0 }}>{k}</span>
                <span style={{ fontWeight:k==="고객명"||k==="품목"?700:600 }}>{v}</span>
              </div>
            ))}
            <div className="bc" style={{ marginTop:12, display:"flex", flexDirection:"column", alignItems:"center" }}>
              <Barcode value={d.id} h={58} />
              <div style={{ fontSize:9, color:"#888", marginTop:4 }}>주문 ID: {d.id}</div>
            </div>
          </div>
        </div>
        <div style={{ padding:"14px 22px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"8px 16px", background:C.border2, color:C.muted2, border:"none", borderRadius:6, cursor:"pointer", fontSize:13 }}>닫기</button>
          <button onClick={print} style={{ padding:"8px 16px", background:C.accent, color:"#000", border:"none", borderRadius:6, cursor:"pointer", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
            <Printer size={14} /> 인쇄
          </button>
        </div>
      </div>
    </div>
  );
}

function DeliveryPage() {
  const { deliveries, setDeliveries, fontSize } = useContext(AppCtx);
  const [selDate, setSelDate] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editDel, setEditDel] = useState(null);
  const [printDel, setPrintDel] = useState(null);
  const [checked, setChecked] = useState(new Set());
  const [search, setSearch] = useState("");
  const dragFrom = useRef(null);
  const dragTo = useRef(null);

  const base = selDate ? deliveries.filter(d=>d.deliveryDate===selDate) : deliveries;
  const list = search ? base.filter(d => d.customerName.includes(search)||d.address.includes(search)||d.store.includes(search)||d.items.includes(search)) : base;

  const save = (form) => {
    if (editDel) {
      setDeliveries(p=>p.map(d=>d.id===editDel.id?{...d,...form}:d));
    } else {
      setDeliveries(p=>[...p,{...form,id:genId(),order:p.length+1}]);
    }
    setShowAdd(false); setEditDel(null);
  };

  const bulkDelete = () => {
    setDeliveries(p=>p.filter(d=>!checked.has(d.id)).map((d,i)=>({...d,order:i+1})));
    setChecked(new Set());
  };

  const toggle = id => setChecked(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleAll = () => setChecked(checked.size===list.length&&list.length>0 ? new Set() : new Set(list.map(d=>d.id)));

  const onDragStart = (e,id) => { dragFrom.current=id; e.dataTransfer.effectAllowed="move"; };
  const onDragOver  = (e,id) => { e.preventDefault(); dragTo.current=id; };
  const onDrop = e => {
    e.preventDefault();
    if (!dragFrom.current || dragFrom.current===dragTo.current) return;
    setDeliveries(p => {
      const arr=[...p];
      const fi=arr.findIndex(d=>d.id===dragFrom.current);
      const ti=arr.findIndex(d=>d.id===dragTo.current);
      const [moved]=arr.splice(fi,1);
      arr.splice(ti,0,moved);
      return arr.map((d,i)=>({...d,order:i+1}));
    });
    dragFrom.current=null; dragTo.current=null;
  };

  const SC = s => s==="completed"?C.green:s==="inprogress"?C.blue:C.accent;
  const SL = s => s==="completed"?"완료":s==="inprogress"?"배송중":"대기";

  const TH = { padding:"9px 11px", textAlign:"left", color:C.muted, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap", background:C.bg, position:"sticky", top:0 };
  const TD = { padding:"9px 11px", color:C.text, verticalAlign:"middle", borderBottom:`1px solid ${C.border}22` };

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden", position:"relative" }}>
      <CalendarSidebar selectedDate={selDate} onSelect={setSelDate} deliveries={deliveries} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"9px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:C.card, flexShrink:0, gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
            <span style={{ color:C.muted2, fontSize:12, whiteSpace:"nowrap" }}>
              {selDate?`📅 ${selDate}`:"📋 전체"} <span style={{ color:C.accent, fontWeight:700 }}>{list.length}건</span>
            </span>
            <div style={{ position:"relative", maxWidth:220, flex:1 }}>
              <Search size={13} style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:C.muted, pointerEvents:"none" }} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="검색..." style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:6, color:C.text, padding:"6px 8px 6px 26px", fontSize:12, outline:"none", boxSizing:"border-box" }} />
            </div>
            {checked.size>0 && (
              <button onClick={bulkDelete} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 11px", background:"#3a1010", color:C.red, border:`1px solid ${C.red}44`, borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
                <Trash2 size={13} /> {checked.size}개 삭제
              </button>
            )}
          </div>
          <button onClick={()=>{ setEditDel(null); setShowAdd(true); }} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:C.accent, color:"#000", border:"none", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, whiteSpace:"nowrap" }}>
            <Plus size={15} /> 일정 추가
          </button>
        </div>

        <div style={{ flex:1, overflow:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize }}>
            <thead>
              <tr>
                <th style={{ ...TH, width:34 }}><input type="checkbox" checked={checked.size===list.length&&list.length>0} onChange={toggleAll} style={{ accentColor:C.accent, cursor:"pointer" }} /></th>
                <th style={{ ...TH, width:46, textAlign:"center" }}>No.</th>
                <th style={TH}>배송일</th>
                <th style={TH}>구입처</th>
                <th style={TH}>고객명</th>
                <th style={TH}>연락처</th>
                <th style={{ ...TH, minWidth:150 }}>주소</th>
                <th style={TH}>색상</th>
                <th style={{ ...TH, minWidth:160 }}>주문 품목</th>
                <th style={{ ...TH, minWidth:80 }}>기타</th>
                <th style={TH}>상태</th>
                <th style={{ ...TH, textAlign:"center", minWidth:86 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d,i) => (
                <tr key={d.id} draggable onDragStart={e=>onDragStart(e,d.id)} onDragOver={e=>onDragOver(e,d.id)} onDrop={onDrop}
                  style={{ background:checked.has(d.id)?"#1d4ed833":d.rowColor||C.card, cursor:"grab", transition:"opacity 0.1s" }}>
                  <td style={TD}><input type="checkbox" checked={checked.has(d.id)} onChange={()=>toggle(d.id)} style={{ accentColor:C.accent, cursor:"pointer" }} /></td>
                  <td style={{ ...TD, textAlign:"center" }}>
                    <div style={{ width:26, height:26, borderRadius:4, background:C.border2, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto", color:C.text, fontWeight:700, fontSize:12 }}>{i+1}</div>
                  </td>
                  <td style={{ ...TD, color:C.accent2, fontWeight:700, whiteSpace:"nowrap" }}>{d.deliveryDate}</td>
                  <td style={{ ...TD, fontSize:"0.92em", whiteSpace:"nowrap" }}>{d.store||"—"}</td>
                  <td style={{ ...TD, fontWeight:700, whiteSpace:"nowrap" }}>{d.customerName}</td>
                  <td style={{ ...TD, color:"#93c5fd", fontFamily:"monospace", fontSize:"0.9em", whiteSpace:"nowrap" }}>{d.phone||"—"}</td>
                  <td style={{ ...TD, fontSize:"0.87em", color:"#b0c4d8", maxWidth:180 }}>{d.address||"—"}</td>
                  <td style={TD}><span style={{ background:C.border, padding:"2px 7px", borderRadius:4, fontSize:"0.87em", whiteSpace:"nowrap" }}>{d.color||"—"}</span></td>
                  <td style={{ ...TD, fontSize:"0.9em" }}>{d.items||"—"}</td>
                  <td style={{ ...TD, color:C.muted2, fontSize:"0.87em" }}>{d.notes||"—"}</td>
                  <td style={TD}>
                    <span style={{ background:SC(d.status)+"20", color:SC(d.status), padding:"3px 8px", borderRadius:20, fontSize:"0.82em", fontWeight:700, border:`1px solid ${SC(d.status)}44`, whiteSpace:"nowrap" }}>{SL(d.status)}</span>
                  </td>
                  <td style={{ ...TD, textAlign:"center" }}>
                    <div style={{ display:"flex", gap:5, justifyContent:"center" }}>
                      <button onClick={()=>{ setEditDel(d); setShowAdd(true); }} title="수정" style={{ padding:"5px 8px", background:C.border2, color:C.muted2, border:"none", borderRadius:5, cursor:"pointer", display:"flex" }}><Edit size={12} /></button>
                      <button onClick={()=>setPrintDel(d)} title="라벨 인쇄" style={{ padding:"5px 8px", background:"#0d2744", color:"#60a5fa", border:"none", borderRadius:5, cursor:"pointer", display:"flex" }}><Printer size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length===0 && (
                <tr><td colSpan={12} style={{ textAlign:"center", padding:48, color:C.muted }}>
                  {search ? "검색 결과가 없습니다." : "배송 일정이 없습니다. '일정 추가' 버튼을 눌러 등록하세요."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <DeliveryModal onClose={()=>{ setShowAdd(false); setEditDel(null); }} onSave={save} init={editDel} />}
      {printDel && <PrintLabelModal d={printDel} onClose={()=>setPrintDel(null)} />}
    </div>
  );
}

function ItemsPage() {
  const { items, setItems, sets, setSets, fontSize } = useContext(AppCtx);
  const [tab, setTab] = useState("items");
  const [search, setSearch] = useState("");
  const [showItemModal, setShowItemModal] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editSet, setEditSet]   = useState(null);
  const [iForm, setIForm] = useState({ name:"", color:"", barcode:"", stock:0 });
  const [sForm, setSForm] = useState({ name:"", barcode:"", notes:"", components:[] });
  const [newComp, setNewComp] = useState({ name:"", color:"", qty:1 });
  const csvRef = useRef(); const setCsvRef = useRef();

  const filteredItems = items.filter(i => !search || i.name.includes(search)||i.color.includes(search)||i.barcode.includes(search));

  const openEditItem = it => { setEditItem(it); setIForm({ name:it.name, color:it.color, barcode:it.barcode, stock:it.stock }); setShowItemModal(true); };
  const openEditSet  = st => { setEditSet(st); setSForm({ name:st.name, barcode:st.barcode, notes:st.notes, components:[...st.components] }); setShowSetModal(true); };

  const saveItem = () => {
    if (!iForm.name) return;
    if (editItem) { setItems(p=>p.map(i=>i.id===editItem.id?{...i,...iForm}:i)); }
    else { setItems(p=>[...p,{...iForm,id:genId()}]); }
    setShowItemModal(false); setEditItem(null); setIForm({ name:"", color:"", barcode:"", stock:0 });
  };

  const saveSet = () => {
    if (!sForm.name) return;
    if (editSet) { setSets(p=>p.map(s=>s.id===editSet.id?{...s,...sForm}:s)); }
    else { setSets(p=>[...p,{...sForm,id:genId()}]); }
    setShowSetModal(false); setEditSet(null); setSForm({ name:"", barcode:"", notes:"", components:[] });
  };

  const deleteItem = id => setItems(p=>p.filter(i=>i.id!==id));
  const deleteSet  = id => setSets(p=>p.filter(s=>s.id!==id));
  const addComp    = () => { if(!newComp.name) return; setSForm(p=>({...p,components:[...p.components,{...newComp}]})); setNewComp({name:"",color:"",qty:1}); };

  const handleCSV = e => {
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const rows=ev.target.result.split("\n").slice(1);
      const newItems=rows.filter(r=>r.trim()).map(row=>{
        const [name,color,barcode,stock]=row.split(",").map(c=>c.trim().replace(/"/g,""));
        return { id:genId(), name:name||"", color:color||"", barcode:barcode||"", stock:parseInt(stock)||0 };
      });
      setItems(p=>[...p,...newItems]);
    };
    reader.readAsText(file); e.target.value="";
  };

  const handleSetCSV = e => {
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const rows=ev.target.result.split("\n").slice(1);
      const newSets=rows.filter(r=>r.trim()).map(row=>{
        const [name,barcode,notes,comps]=row.split(",").map(c=>c.trim().replace(/"/g,""));
        const components=(comps||"").split(";").filter(Boolean).map(cp=>{
          const [nm,cl,qt]=cp.split(":"); return { name:nm||"", color:cl||"", qty:parseInt(qt)||1 };
        });
        return { id:genId(), name:name||"", barcode:barcode||"", notes:notes||"", components };
      });
      setSets(p=>[...p,...newSets]);
    };
    reader.readAsText(file); e.target.value="";
  };

  const IS = { background:C.bg, border:`1px solid ${C.border2}`, borderRadius:6, color:C.text, padding:"7px 10px", fontSize:13, outline:"none", boxSizing:"border-box" };
  const TH = { padding:"9px 12px", textAlign:"left", color:C.muted, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap", background:C.bg };
  const TD = { padding:"10px 12px", color:C.text, verticalAlign:"middle", borderBottom:`1px solid ${C.border}22` };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden", position:"relative" }}>
      <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, background:C.card, flexShrink:0 }}>
        {[["items",`📦 품목 관리`,items.length],["sets",`🧩 세트 관리`,sets.length]].map(([key,label,count])=>(
          <button key={key} onClick={()=>setTab(key)} style={{ padding:"12px 22px", background:"none", border:"none", borderBottom:tab===key?`3px solid ${C.accent}`:"3px solid transparent", color:tab===key?C.accent:C.muted, cursor:"pointer", fontSize:14, fontWeight:tab===key?700:400, display:"flex", alignItems:"center", gap:7, fontFamily:"inherit" }}>
            {label}
            <span style={{ background:C.border2, color:C.muted2, padding:"1px 8px", borderRadius:10, fontSize:11 }}>{count}</span>
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflow:"auto", padding:16 }}>
        {tab==="items" && (
          <>
            <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ position:"relative", flex:"1 1 200px", maxWidth:280 }}>
                <Search size={13} style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:C.muted, pointerEvents:"none" }} />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="품목 검색..." style={{ ...IS, paddingLeft:28, width:"100%" }} />
              </div>
              <span style={{ color:C.muted, fontSize:10, flex:"1 1 auto" }}>CSV 형식: 제품명, 색상, 바코드, 수량</span>
              <input ref={csvRef} type="file" accept=".csv" onChange={handleCSV} style={{ display:"none" }} />
              <button onClick={()=>csvRef.current.click()} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", background:"#0d2a1a", color:C.green, border:`1px solid ${C.green}44`, borderRadius:7, cursor:"pointer", fontSize:12, whiteSpace:"nowrap" }}>
                <Upload size={13} /> CSV 업로드
              </button>
              <button onClick={()=>{ setEditItem(null); setIForm({name:"",color:"",barcode:"",stock:0}); setShowItemModal(true); }} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", background:C.accent, color:"#000", border:"none", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
                <Plus size={13} /> 품목 추가
              </button>
            </div>

            <table style={{ width:"100%", borderCollapse:"collapse", fontSize }}>
              <thead>
                <tr>{["번호","제품명","색상","바코드","재고","바코드 이미지","관리"].map(h=>(
                  <th key={h} style={TH}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filteredItems.map((item,i)=>(
                  <tr key={item.id} style={{ background:i%2===0?C.card:C.bg }}>
                    <td style={{ ...TD, color:C.muted, width:46 }}>{i+1}</td>
                    <td style={{ ...TD, fontWeight:600 }}>{item.name}</td>
                    <td style={TD}><span style={{ background:C.border, padding:"2px 8px", borderRadius:4, fontSize:11 }}>{item.color}</span></td>
                    <td style={{ ...TD, fontFamily:"monospace", color:"#93c5fd", fontSize:12 }}>{item.barcode}</td>
                    <td style={TD}><span style={{ color:item.stock>5?C.green:item.stock>0?C.accent:C.red, fontWeight:700 }}>{item.stock}</span></td>
                    <td style={TD}><Barcode value={item.barcode} h={36} /></td>
                    <td style={TD}>
                      <div style={{ display:"flex", gap:5 }}>
                        <button onClick={()=>openEditItem(item)} style={{ padding:"4px 8px", background:C.border2, color:C.muted2, border:"none", borderRadius:4, cursor:"pointer", display:"flex" }}><Edit size={12} /></button>
                        <button onClick={()=>deleteItem(item.id)} style={{ padding:"4px 8px", background:"#2a1010", color:C.red, border:"none", borderRadius:4, cursor:"pointer", display:"flex" }}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length===0 && <tr><td colSpan={7} style={{ textAlign:"center", padding:36, color:C.muted }}>품목이 없습니다.</td></tr>}
              </tbody>
            </table>
          </>
        )}

        {tab==="sets" && (
          <>
            <div style={{ display:"flex", gap:8, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
              <span style={{ color:C.muted, fontSize:10, flex:"1 1 auto" }}>CSV: 세트명, 바코드, 메모, 구성품(이름:색상:수량;...)</span>
              <input ref={setCsvRef} type="file" accept=".csv" onChange={handleSetCSV} style={{ display:"none" }} />
              <button onClick={()=>setCsvRef.current.click()} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", background:"#0d2a1a", color:C.green, border:`1px solid ${C.green}44`, borderRadius:7, cursor:"pointer", fontSize:12 }}>
                <Upload size={13} /> CSV 업로드
              </button>
              <button onClick={()=>{ setEditSet(null); setSForm({name:"",barcode:"",notes:"",components:[]}); setShowSetModal(true); }} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", background:C.accent, color:"#000", border:"none", borderRadius:7, cursor:"pointer", fontSize:12, fontWeight:700 }}>
                <Plus size={13} /> 세트 추가
              </button>
            </div>
            <div style={{ display:"grid", gap:10 }}>
              {sets.map((set)=>(
                <div key={set.id} style={{ background:C.card, border:`1px solid ${C.border2}`, borderRadius:10, padding:16 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ color:C.text, fontWeight:700, fontSize:14, marginBottom:4 }}>🧩 {set.name}</div>
                      <div style={{ fontFamily:"monospace", color:"#93c5fd", fontSize:11, marginBottom:4 }}>{set.barcode}</div>
                      {set.notes && <div style={{ color:C.muted2, fontSize:12 }}>{set.notes}</div>}
                      <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap" }}>
                        {set.components.map((comp,ci)=>(
                          <span key={ci} style={{ background:C.bg, border:`1px solid ${C.border2}`, borderRadius:6, padding:"4px 10px", fontSize:11, color:C.text }}>
                            {comp.name} <span style={{ color:C.muted }}>({comp.color})</span> <span style={{ color:C.accent, fontWeight:700 }}>×{comp.qty}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, alignItems:"flex-start", flexShrink:0 }}>
                      <Barcode value={set.barcode} h={38} />
                      <button onClick={()=>openEditSet(set)} style={{ padding:"5px 8px", background:C.border2, color:C.muted2, border:"none", borderRadius:5, cursor:"pointer", display:"flex" }}><Edit size={13} /></button>
                      <button onClick={()=>deleteSet(set.id)} style={{ padding:"5px 8px", background:"#2a1010", color:C.red, border:"none", borderRadius:5, cursor:"pointer", display:"flex" }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {sets.length===0 && <div style={{ textAlign:"center", padding:40, color:C.muted }}>등록된 세트가 없습니다.</div>}
            </div>
          </>
        )}
      </div>

      {showItemModal && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:C.card2, borderRadius:12, width:420, border:`1px solid ${C.border2}` }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ color:C.text, margin:0, fontSize:15 }}>{editItem?"품목 수정":"품목 추가"}</h3>
              <button onClick={()=>{ setShowItemModal(false); setEditItem(null); }} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer" }}><X size={17} /></button>
            </div>
            <div style={{ padding:20, display:"grid", gap:12 }}>
              {[["제품명","name","text","예: 소파 3인용"],["색상","color","text","예: 오크 브라운"],["바코드","barcode","text","예: SF001-OB"]].map(([label,key,type,ph])=>(
                <div key={key}>
                  <label style={{ color:C.muted2, fontSize:11, display:"block", marginBottom:4 }}>{label}</label>
                  <input type={type} value={iForm[key]} onChange={e=>setIForm(p=>({...p,[key]:e.target.value}))} placeholder={ph} style={{ ...IS, width:"100%" }} />
                </div>
              ))}
              <div>
                <label style={{ color:C.muted2, fontSize:11, display:"block", marginBottom:4 }}>수량</label>
                <input type="number" value={iForm.stock} onChange={e=>setIForm(p=>({...p,stock:parseInt(e.target.value)||0}))} style={{ ...IS, width:"100%" }} />
              </div>
            </div>
            <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, justifyContent:"flex-end" }}>
              <button onClick={()=>{ setShowItemModal(false); setEditItem(null); }} style={{ padding:"8px 15px", background:C.border2, color:C.muted2, border:"none", borderRadius:6, cursor:"pointer" }}>취소</button>
              <button onClick={saveItem} style={{ padding:"8px 15px", background:C.accent, color:"#000", border:"none", borderRadius:6, cursor:"pointer", fontWeight:700 }}>{editItem?"수정":"추가"}</button>
            </div>
          </div>
        </div>
      )}

      {showSetModal && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:C.card2, borderRadius:12, width:520, maxHeight:"88vh", overflow:"auto", border:`1px solid ${C.border2}` }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.card2, zIndex:1 }}>
              <h3 style={{ color:C.text, margin:0, fontSize:15 }}>{editSet?"세트 수정":"세트 추가"}</h3>
              <button onClick={()=>{ setShowSetModal(false); setEditSet(null); }} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer" }}><X size={17} /></button>
            </div>
            <div style={{ padding:20, display:"grid", gap:13 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ color:C.muted2, fontSize:11, display:"block", marginBottom:4 }}>세트명</label>
                  <input type="text" value={sForm.name} onChange={e=>setSForm(p=>({...p,name:e.target.value}))} placeholder="모듈 식탁 세트" style={{ ...IS, width:"100%" }} />
                </div>
                <div>
                  <label style={{ color:C.muted2, fontSize:11, display:"block", marginBottom:4 }}>바코드</label>
                  <input type="text" value={sForm.barcode} onChange={e=>setSForm(p=>({...p,barcode:e.target.value}))} placeholder="SET-001" style={{ ...IS, width:"100%" }} />
                </div>
              </div>
              <div>
                <label style={{ color:C.muted2, fontSize:11, display:"block", marginBottom:4 }}>메모</label>
                <input type="text" value={sForm.notes} onChange={e=>setSForm(p=>({...p,notes:e.target.value}))} placeholder="세트 설명" style={{ ...IS, width:"100%" }} />
              </div>
              <div>
                <label style={{ color:C.muted2, fontSize:11, display:"block", marginBottom:8 }}>구성 품목</label>
                {sForm.components.map((comp,ci)=>(
                  <div key={ci} style={{ display:"flex", alignItems:"center", gap:6, background:C.bg, padding:"6px 10px", borderRadius:6, marginBottom:5 }}>
                    <span style={{ flex:1, color:C.text, fontSize:12 }}>{comp.name} / {comp.color} / ×{comp.qty}</span>
                    <button onClick={()=>setSForm(p=>({...p,components:p.components.filter((_,i)=>i!==ci)}))} style={{ background:"none", border:"none", color:C.red, cursor:"pointer", padding:2 }}><X size={13} /></button>
                  </div>
                ))}
                <div style={{ display:"flex", gap:6, marginTop:6 }}>
                  <input value={newComp.name} onChange={e=>setNewComp(p=>({...p,name:e.target.value}))} placeholder="품목명" style={{ ...IS, flex:2 }} />
                  <input value={newComp.color} onChange={e=>setNewComp(p=>({...p,color:e.target.value}))} placeholder="색상" style={{ ...IS, flex:1 }} />
                  <input type="number" value={newComp.qty} onChange={e=>setNewComp(p=>({...p,qty:parseInt(e.target.value)||1}))} min={1} style={{ ...IS, width:58 }} />
                  <button onClick={addComp} style={{ padding:"7px 12px", background:C.accent, color:"#000", border:"none", borderRadius:5, cursor:"pointer", fontWeight:700, fontSize:14 }}>+</button>
                </div>
              </div>
            </div>
            <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, justifyContent:"flex-end", position:"sticky", bottom:0, background:C.card2 }}>
              <button onClick={()=>{ setShowSetModal(false); setEditSet(null); }} style={{ padding:"8px 15px", background:C.border2, color:C.muted2, border:"none", borderRadius:6, cursor:"pointer" }}>취소</button>
              <button onClick={saveSet} style={{ padding:"8px 15px", background:C.accent, color:"#000", border:"none", borderRadius:6, cursor:"pointer", fontWeight:700 }}>{editSet?"수정":"추가"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [deliveries, setDeliveries] = useState(DELIVERIES_INIT);
  const [items, setItems] = useState(ITEMS_INIT);
  const [sets, setSets] = useState(SETS_INIT);
  const [page, setPage] = useState("delivery");
  const [fontSize, setFontSize] = useState(13);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  const ctx = { deliveries, setDeliveries, items, setItems, sets, setSets, fontSize };

  return (
    <AppCtx.Provider value={ctx}>
      <div style={{ display:"flex", flexDirection:"column", height:"100vh", minHeight:"600px", background:C.bg, fontFamily:"'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif", color:C.text, overflow:"hidden", position:"relative" }}>

        <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", height:54, background:C.card, borderBottom:`1px solid ${C.border}`, flexShrink:0, zIndex:100, gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <div style={{ width:34, height:34, background:C.accent, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Package size={18} style={{ color:"#000" }} />
            </div>
            <div>
              <div style={{ color:C.text, fontWeight:800, fontSize:15, letterSpacing:"-0.02em", lineHeight:1.2 }}>가구 배송 관리</div>
              <div style={{ color:C.muted, fontSize:9, letterSpacing:"0.06em" }}>FURNITURE DELIVERY SYSTEM</div>
            </div>
          </div>

          <nav style={{ display:"flex", gap:3, background:C.bg, borderRadius:8, padding:3, border:`1px solid ${C.border}` }}>
            {[["delivery","📅 배송 일정"],["items","📦 품목 / 세트"]].map(([key,label])=>(
              <button key={key} onClick={()=>setPage(key)} style={{ padding:"6px 16px", background:page===key?C.accent:"transparent", color:page===key?"#000":C.muted, border:"none", borderRadius:5, cursor:"pointer", fontWeight:page===key?700:400, fontSize:13, fontFamily:"inherit", transition:"all 0.15s" }}>
                {label}
              </button>
            ))}
          </nav>

          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <span style={{ color:C.muted, fontSize:11 }}>글자 크기</span>
            <button onClick={()=>setFontSize(s=>Math.max(10,s-1))} style={{ width:30, height:30, background:C.border2, color:C.text, border:`1px solid ${C.border2}`, borderRadius:6, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ZoomOut size={14} />
            </button>
            <span style={{ color:C.accent, fontSize:12, minWidth:22, textAlign:"center", fontWeight:700, fontFamily:"monospace" }}>{fontSize}</span>
            <button onClick={()=>setFontSize(s=>Math.min(20,s+1))} style={{ width:30, height:30, background:C.border2, color:C.text, border:`1px solid ${C.border2}`, borderRadius:6, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ZoomIn size={14} />
            </button>
          </div>
        </header>

        <main style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>
          {page==="delivery" ? <DeliveryPage /> : <ItemsPage />}
        </main>

        <div style={{ height:24, background:C.card, borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px", flexShrink:0 }}>
          <span style={{ color:C.muted, fontSize:9, letterSpacing:"0.04em" }}>
            ⚡ 로컬 모드 — 상단 Firebase 연동 코드 주석 해제 시 실시간 멀티유저 동기화 활성화
          </span>
          <span style={{ color:C.muted, fontSize:9 }}>가구 배송 관리 시스템 v1.0 | 드래그로 순서 변경</span>
        </div>
      </div>
    </AppCtx.Provider>
  );
}
