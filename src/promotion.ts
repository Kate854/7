export const PROMO_THRESHOLD=1000;
export const MAX_GIFT_QUANTITY=1;
export type Product={id:string;article:string;name:string;price:number;image:string;quantity:number;isPromotionEligible:boolean;isGift?:boolean;weight?:number};
export type DraftSelection=Record<string,number>;
export function eligibleSubtotal(cart:Product[]){return cart.reduce((sum,item)=>sum+(item.isPromotionEligible&&!item.isGift?item.price*item.quantity:0),0);}
export function remainingAmount(cart:Product[]){return Math.max(0,PROMO_THRESHOLD-eligibleSubtotal(cart));}
export function giftUnlocked(cart:Product[]){return eligibleSubtotal(cart)>=PROMO_THRESHOLD;}
export function draftSubtotal(draft:DraftSelection,catalog:Product[]){return catalog.reduce((sum,p)=>sum+p.price*(draft[p.id]||0),0);}
export function canConfirm(cart:Product[],draft:DraftSelection,catalog:Product[]){return draftSubtotal(draft,catalog)>0&&eligibleSubtotal(cart)+draftSubtotal(draft,catalog)>=PROMO_THRESHOLD;}
export function changeDraft(draft:DraftSelection,id:string,delta:number):DraftSelection{const next={...draft};const qty=Math.max(0,(next[id]||0)+delta);if(qty)next[id]=qty;else delete next[id];return next;}
export function mergeDraft(cart:Product[],draft:DraftSelection,catalog:Product[]):Product[]{const next=cart.filter(p=>!p.isGift).map(p=>({...p}));for(const p of catalog){const qty=draft[p.id]||0;if(!Number.isSafeInteger(qty)||qty<=0)continue;const existing=next.find(item=>item.id===p.id);if(existing)existing.quantity+=qty;else next.push({...p,quantity:qty});}return next;}
export function quantityChange(cart:Product[],id:string,delta:number){return cart.map(p=>p.id===id?{...p,quantity:Math.max(0,p.quantity+delta)}:p).filter(p=>p.quantity>0);}
export function cartSubtotal(cart:Product[],selected?:Set<string>){return cart.reduce((sum,p)=>sum+(!p.isGift&&(!selected||selected.has(p.id))?p.price*p.quantity:0),0);}
