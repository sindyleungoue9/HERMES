import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { FileSpreadsheet, FileText, Plus, Search, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import logoImage from '../assets/logo-mbss.jpg'

type DashboardView = 'dashboard' | 'import' | 'products' | 'history' | 'profile'
type Theme = 'light' | 'dark'
type Language = 'FR' | 'EN'

type EmployeeDashboardProps = {
  onLogout: () => void
}

const navigation: { id: DashboardView; label: Record<Language, string>; icon: string }[] = [
  { id: 'dashboard', label: { FR: 'Tableau de bord', EN: 'Dashboard' }, icon: '▣' },
  { id: 'import', label: { FR: 'Importer une RFQ', EN: 'Import RFQ' }, icon: '⇧' },
  { id: 'history', label: { FR: 'Historique', EN: 'History' }, icon: '☷' },
  { id: 'products', label: { FR: 'Produits & Prix', EN: 'Products & Prices' }, icon: '◇' },
  { id: 'profile', label: { FR: 'Profil', EN: 'Profile' }, icon: '♙' },
]

const rfqRows = [
  ['RFQ-2026-00452', 'GloBeCo Ship Supply', 'MV Eco Merlin', '14', 'En traitement'],
  ['RFQ-2026-00448', 'Abidjan Marine Services', 'MV Lila Incheon', '87', 'À vérifier'],
  ['RFQ-2026-00441', 'GloBeCo Ship Supply', 'MV Cabin Stores', '21', 'Non trouvé'],
  ['RFQ-2026-00437', 'Douala Port Logistics', 'MV Atlantic Star', '46', 'Devis envoyé'],
]

export default function EmployeeDashboard({ onLogout }: EmployeeDashboardProps) {
  const [activeView, setActiveView] = useState<DashboardView>('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')
  const [language, setLanguage] = useState<Language>('FR')
  const [importStage, setImportStage] = useState<WorkflowStage>('import')

  const activePage = navigation.find((item) => item.id === activeView) ?? navigation[0]
  const text = language === 'FR' ? {
    logout: 'Déconnexion', welcome: 'Bienvenue dans votre espace de travail',
    products: 'Produits & Prix', productHeaders: ['Référence', 'Désignation', 'Fournisseur', 'Prix'],
  } : {
    logout: 'Log Out', welcome: 'Welcome to your workspace',
    products: 'Products & Prices', productHeaders: ['Reference', 'Description', 'Supplier', 'Price'],
  }

  return (
    <div className={`dashboard-shell min-h-screen bg-[#f4f7fb] text-slate-700 ${theme === 'dark' ? 'theme-dark' : ''}`}>
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#213b8b] p-4 text-white shadow-xl transition-transform lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 border-b border-white/10 px-2 pb-7">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white"><img className="h-full w-full object-contain" src={logoImage} alt="Logo M.B.S.S" /></div>
          <div>
            <p className="font-bold tracking-wide">MBSS ERP</p>
            <p className="text-[9px] tracking-[.18em] text-[#6be477]">ESPACE EMPLOYÉ</p>
          </div>
        </div>

        <nav className="mt-8 space-y-2" aria-label={language === 'FR' ? 'Navigation principale' : 'Main navigation'}>
          {navigation.map((item) => (
            <button
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${activeView === item.id ? 'bg-[#36a445] font-bold text-white shadow-lg shadow-[#36a445]/25' : 'text-blue-100/75 hover:bg-white/10'}`}
              key={item.id}
              onClick={() => { setActiveView(item.id); setIsMobileMenuOpen(false) }}
              type="button"
            >
              <span className={`w-5 text-center text-base ${activeView === item.id ? 'text-white' : 'text-blue-200/80 group-hover:text-white'}`} aria-hidden="true">{item.icon}</span>
              {item.label[language]}
            </button>
          ))}
        </nav>

        <button className="mt-auto flex items-center gap-3 px-3 py-3 text-sm text-red-200 hover:text-white" onClick={onLogout} type="button">
          ⇥ {text.logout}
        </button>
      </aside>

      {isMobileMenuOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} aria-label="Fermer le menu" type="button" />}

      <div className="lg:pl-64">
        <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-8">
          <div className="flex items-center gap-4">
            <button className="text-2xl text-[#22439c] lg:hidden" onClick={() => setIsMobileMenuOpen(true)} type="button" aria-label="Ouvrir le menu">☰</button>
            <div>
              <h1 className="text-xl font-bold text-[#22439c] sm:text-2xl">{activePage.label[language]}</h1>
              {activeView === 'dashboard' && <p className="mt-1 text-xs text-slate-400">{text.welcome}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <button className="hidden text-lg text-slate-400 transition hover:text-[#22439c] sm:block" type="button" aria-label="Notifications">♧</button>
            <button className="hidden rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-500 transition hover:border-[#22439c] hover:text-[#22439c] sm:block" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} type="button" aria-label="Changer de thème">{theme === 'light' ? '☾' : '☀'}</button>
            <div className="flex rounded-full bg-slate-100 p-1 text-[11px] font-semibold">
              <button className={`rounded-full px-3 py-1.5 ${language === 'FR' ? 'bg-[#36a445] text-white' : 'text-slate-500'}`} onClick={() => setLanguage('FR')} type="button">FR</button>
              <button className={`rounded-full px-3 py-1.5 ${language === 'EN' ? 'bg-[#36a445] text-white' : 'text-slate-500'}`} onClick={() => setLanguage('EN')} type="button">EN</button>
            </div>
            <div className="hidden items-center gap-2 border-l border-slate-200 pl-4 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22439c] text-xs font-bold text-white">JT</div>
              <div className="text-xs"><strong className="block text-slate-700">Jean Tabi</strong><span className="text-slate-400">Service Ventes</span></div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] p-5 sm:p-8 lg:p-9">
          {activeView === 'dashboard' && <DashboardHome onNavigate={setActiveView} language={language} />}
          {activeView === 'import' && <ImportPreview language={language} initialStage={importStage} />}
          {activeView === 'products' && <ProductsAndPricing language={language} />}
          {activeView === 'history' && <RfqHistory language={language} onFinalize={() => { setImportStage('results'); setActiveView('import') }} />}
          {activeView === 'profile' && <ProfilePreview theme={theme} setTheme={setTheme} />}
        </main>
      </div>
    </div>
  )
}

function DashboardHome({ onNavigate, language }: { onNavigate: (view: DashboardView) => void; language: Language }) {
  const rfqs = useQuery(api.rfqs.listRecent)
  const rows = rfqs?.length
    ? rfqs.map((rfq) => [rfq.reference, rfq.client, rfq.vessel, String(rfq.articleCount), translateRfqStatus(rfq.status, language)])
    : rfqRows
  const stats = [['Mes RFQ', '24', 'text-[#22439c]', '↗'], ['À traiter', '5', 'text-amber-500', '◷'], ['En attente de prix', '3', 'text-slate-800', '◇'], ['Devis envoyés', '18', 'text-[#36a445]', '✓']]

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, color, icon]) => <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" key={label}><div className="flex items-start justify-between"><p className="text-xs font-medium text-slate-400">{label}</p><span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-sm font-bold ${color}`}>{icon}</span></div><p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p><p className="mt-1 text-[11px] text-slate-400">Mis à jour aujourd'hui</p></div>)}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="rounded-xl bg-[#36a445] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#36a445]/25 hover:bg-[#2d913b]" onClick={() => { onNavigate('import'); }} type="button">＋ Importer une nouvelle RFQ</button>
        <button className="rounded-xl border border-[#cbd8f4] bg-white px-5 py-3 text-sm font-bold text-[#22439c]" onClick={() => onNavigate('history')} type="button">⇩ {language === 'FR' ? 'Consulter l’historique' : 'View RFQ history'}</button>
      </div>
      <section className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4"><div><h2 className="font-bold text-slate-700">{language === 'FR' ? 'RFQ qui me sont assignées' : 'RFQs assigned to me'}</h2><p className="mt-1 text-xs text-slate-400">{language === 'FR' ? 'Les dernières demandes à suivre' : 'Latest requests to follow'}</p></div><button className="text-xs font-bold text-[#22439c]" onClick={() => onNavigate('history')} type="button">{language === 'FR' ? 'Voir tout' : 'View all'} →</button></div>
        <Table headers={['Référence', 'Client', 'Navire', 'Articles', 'Statut']} rows={rows} />
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-bold text-slate-700">Activité de la semaine</h2><span className="text-xs text-slate-400">7 derniers jours</span></div><div className="flex h-32 items-end justify-around gap-3 pt-6">{[35, 60, 28, 78, 48, 65, 22].map((height, index) => <div className={`w-9 rounded-t-md transition hover:opacity-80 ${index === 3 ? 'bg-[#36a445]' : index === 1 || index === 5 ? 'bg-[#22439c]' : 'bg-[#c8d9f6]'}`} style={{ height: `${height}%` }} key={`${height}-${index}`} />)}</div><div className="mt-2 flex justify-around text-[10px] text-slate-400"><span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span></div></section>
        <section className="relative overflow-hidden rounded-2xl bg-[#111e57] p-6 text-blue-100 shadow-sm"><div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-[#22439c]/40" /><div className="relative"><h2 className="font-bold text-[#6be477]">⚓ Astuce du jour</h2><p className="mt-5 max-w-lg text-sm leading-6 text-blue-100/80">Importez la RFQ en PDF ou Excel : l'extraction automatique remplit les articles et propose les correspondances du catalogue.</p><p className="mt-8 text-xs font-bold text-white">Agence de Douala · Bonantone</p></div></section>
      </div>
    </>
  )
}

function translateRfqStatus(status: 'processing' | 'to_review' | 'not_found' | 'sent', language: Language) {
  const labels = {
    FR: { processing: 'En traitement', to_review: 'À vérifier', not_found: 'Non trouvé', sent: 'Devis envoyé' },
    EN: { processing: 'Processing', to_review: 'To review', not_found: 'Not found', sent: 'Quote sent' },
  }
  return labels[language][status]
}

type WorkflowStage = 'import' | 'processing' | 'results' | 'final' | 'validated'
type QuoteRow = { number: number; code: string; description: string; unit: string; quantity: number; unitPrice: number; remarks: string; group: 'found' | 'uncertain' | 'missing' }

const initialQuoteRows: QuoteRow[] = [
  { number: 1, code: '002213', description: 'OIL OLIVE APP. SLTR SPANISH', unit: 'CAN', quantity: 1, unitPrice: 0, remarks: '', group: 'found' },
  { number: 2, code: '005673', description: 'TOMATO SAUCE 450GRM', unit: 'TIN', quantity: 12, unitPrice: 0, remarks: '', group: 'found' },
  { number: 3, code: '007027', description: 'BEEF BONELESS TOPSIDE, INSIDE', unit: 'KGS', quantity: 60, unitPrice: 0, remarks: '', group: 'uncertain' },
  { number: 4, code: 'PRO00017', description: 'CHICKEN WHOLE', unit: 'KGS', quantity: 70, unitPrice: 0, remarks: '', group: 'missing' },
  { number: 5, code: '001345', description: 'PORK NECK BONELESS', unit: 'KGS', quantity: 40, unitPrice: 0, remarks: '', group: 'missing' },
]

function ImportPreview({ language, initialStage = 'import' }: { language: Language; initialStage?: WorkflowStage }) {
  const [stage, setStage] = useState<WorkflowStage>(initialStage)
function ImportPreview({ language }: { language: Language }) {
  const createRfq = useMutation(api.rfqs.create)
  const [stage, setStage] = useState<WorkflowStage>('import')
  const [rows, setRows] = useState(initialQuoteRows)
  const [selectedRows, setSelectedRows] = useState<number[]>(initialQuoteRows.map((row) => row.number))
  const [manualOpen, setManualOpen] = useState(false)
  const [sourceName, setSourceName] = useState('')
  const [marginMode, setMarginMode] = useState<'individual' | 'global'>('global')
  const [margin, setMargin] = useState(18)
  const [discount, setDiscount] = useState(0)
  const [delivery, setDelivery] = useState(0)
    const [emailOpen, setEmailOpen] = useState(false)
  const [fileName, setFileName] = useState('')
  const [template, setTemplate] = useState('coral')

  useEffect(() => {
    if (stage !== 'processing') return undefined
    const timer = window.setTimeout(() => setStage('results'), 1800)
    return () => window.clearTimeout(timer)
  }, [stage])

  function startProcessing(file?: File) {
    if (file) {
      setFileName(file.name)
      void createRfq({
        reference: `RFQ-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
        client: file.name.replace(/\.[^/.]+$/, '') || 'Import local',
        vessel: 'À préciser',
        articleCount: 0,
        status: 'processing',
      })
    }
    setStage('processing')
  }

  function addManualRow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const row: QuoteRow = { number: rows.length + 1, code: 'MAN-' + String(rows.length + 1).padStart(3, '0'), description: String(form.get('description') || ''), unit: String(form.get('unit') || ''), quantity: Number(form.get('quantity') || 0), unitPrice: Number(form.get('unitPrice') || 0), remarks: 'Ajout manuel', group: 'found' }
      setRows((current) => [...current, row])
    setSelectedRows((current) => [...current, row.number])
    setManualOpen(false)
  }

  const selected = rows.filter((row) => selectedRows.includes(row.number))
  const subtotal = selected.reduce((total, row) => total + row.quantity * row.unitPrice, 0)
  const marginAmount = marginMode === 'global' ? subtotal * margin / 100 : selected.reduce((total, row) => total + row.quantity * row.unitPrice * margin / 100, 0)
  const discountAmount = (subtotal + marginAmount) * discount / 100
  const netTotal = subtotal + marginAmount - discountAmount + delivery
  const groups: { key: QuoteRow['group']; title: string; description: string; color: string }[] = [
    { key: 'found', title: 'Produits correspondants trouvés', description: 'Lignes identifiées dans la base de données.', color: 'border-green-200' },
    { key: 'uncertain', title: 'Produits à vérifier / incertains', description: 'Correspondances partielles à valider humainement.', color: 'border-amber-200' },
    { key: 'missing', title: 'Produits non trouvés / non répertoriés', description: 'Éléments absents de la base de données.', color: 'border-red-200' },
  ]

  if (stage === 'processing') return <ProcessingScreen fileName={fileName} />
  if (stage === 'import') return <ImportDropzone onFile={startProcessing} language={language} template={template} setTemplate={setTemplate} />
  if (stage === 'results') return <ResultsScreen groups={groups} rows={rows} selectedRows={selectedRows} setSelectedRows={setSelectedRows} onManual={() => setManualOpen(true)} onSource={(file) => { setSourceName(file.name); startProcessing(file) }} onGenerate={() => setStage('final')} manualOpen={manualOpen} onManualSubmit={addManualRow} sourceName={sourceName} language={language} />
  // @ts-expect-error The legacy final quotation component still declares an optional export callback.
  return <FinalQuotation rows={selected} subtotal={subtotal} margin={margin} marginMode={marginMode} setMargin={setMargin} setMarginMode={setMarginMode} discount={discount} setDiscount={setDiscount} delivery={delivery} setDelivery={setDelivery} marginAmount={marginAmount} netTotal={netTotal} validated={stage === 'validated'} onValidate={() => setStage('validated')} emailOpen={emailOpen} setEmailOpen={setEmailOpen} />
}

function ImportDropzone({ onFile, language, template, setTemplate }: { onFile: (file?: File) => void; language: Language; template: string; setTemplate: (value: string) => void }) {
  const isFrench = language === 'FR'
  return <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]"><div className="space-y-5"><label className="block cursor-pointer rounded-2xl border-2 border-dashed border-[#36a445] bg-white px-6 py-20 text-center shadow-sm transition hover:bg-green-50/30 focus-within:ring-4 focus-within:ring-[#36a445]/15"><input className="sr-only" type="file" accept=".xlsx,.xls,.doc,.docx,.pdf" onChange={(event) => onFile(event.target.files?.[0])} /><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-[#36a445]">⇧</span><h2 className="mt-5 text-2xl font-bold text-[#22439c]">{isFrench ? 'Déposez votre RFQ ici' : 'Drop your RFQ here'}</h2><p className="mt-2 text-sm text-slate-400">Excel, Word {isFrench ? 'ou' : 'or'} PDF · 20 Mo maximum</p><span className="mt-6 inline-flex rounded-xl bg-[#36a445] px-6 py-3 text-sm font-bold text-white">{isFrench ? 'Parcourir mes fichiers' : 'Browse files'}</span></label><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><label className="block text-sm font-semibold text-slate-600">{isFrench ? 'Modèle de quotation' : 'Quotation template'}<select className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3" value={template} onChange={(event) => setTemplate(event.target.value)}><option value="coral">{isFrench ? 'Modèle Standard Coral VI' : 'Coral VI Standard Template'}</option><option value="abidjan">{isFrench ? 'Modèle Abidjan Marine' : 'Abidjan Marine Template'}</option><option value="douala">{isFrench ? 'Modèle Douala Logistique' : 'Douala Logistics Template'}</option></select></label></div></div><div className="rounded-2xl bg-[#111e57] p-7 text-blue-100"><h2 className="font-bold text-[#6be477]">{isFrench ? 'Ce qui se passe ensuite' : 'What happens next'}</h2><ol className="mt-6 space-y-5 text-sm leading-6"><li>1. {isFrench ? 'Le document est analysé et les articles sont extraits.' : 'The document is analyzed and items are extracted.'}</li><li>2. {isFrench ? 'Chaque ligne est comparée au catalogue M.B.S.S.' : 'Each line is matched against the M.B.S.S. catalog.'}</li><li>3. {isFrench ? 'Vous validez les prix avant la cotation finale.' : 'You validate prices before the final quotation.'}</li></ol></div></div>
}
function ProcessingScreen({ fileName }: { fileName: string }) { return <section className="rounded-2xl border border-slate-200 bg-white px-6 py-24 text-center shadow-sm"><div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-[#36a445]" /><h2 className="mt-7 text-xl font-bold text-[#22439c]">Traitement en cours</h2><p className="mt-3 text-sm text-slate-500">Traitement et extraction des données en cours... Veuillez patienter.</p><p className="mt-2 text-xs text-slate-400">{fileName || 'Votre document'}</p></section> }

function ResultsScreen({ groups, rows, selectedRows, setSelectedRows, onManual, onSource, onGenerate, manualOpen, onManualSubmit, sourceName, language }: { groups: { key: QuoteRow['group']; title: string; description: string; color: string }[]; rows: QuoteRow[]; selectedRows: number[]; setSelectedRows: (rows: number[]) => void; onManual: () => void; onSource: (file: File) => void; onGenerate: () => void; manualOpen: boolean; onManualSubmit: (event: FormEvent<HTMLFormElement>) => void; sourceName: string; language: Language }) {
  const isFrench = language === 'FR'
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {groups.map((group) => <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" key={group.key}><p className="text-xs text-slate-400">{group.title}</p><p className="mt-2 text-3xl font-bold text-[#22439c]">{rows.filter((row) => row.group === group.key).length}</p></div>)}
      </div>
      {groups.map((group) => <section className={`overflow-x-auto rounded-2xl border-2 bg-white p-5 shadow-sm ${group.color}`} key={group.key}><div className="mb-4"><h2 className="font-bold text-slate-700">{group.title}</h2><p className="mt-1 text-xs text-slate-400">{group.description}</p></div><QuotationTable rows={rows.filter((row) => row.group === group.key)} selectedRows={selectedRows} setSelectedRows={setSelectedRows} /></section>)}
      <div className="flex flex-wrap gap-3">
        <button className="rounded-xl border border-[#cbd8f4] bg-white px-5 py-3 text-sm font-bold text-[#22439c]" onClick={onManual} type="button">＋ {isFrench ? 'Ajouter manuellement un produit' : 'Add product manually'}</button>
        <label className="cursor-pointer rounded-xl border border-[#cbd8f4] bg-white px-5 py-3 text-sm font-bold text-[#22439c]"><input className="sr-only" type="file" accept=".xlsx,.xls,.doc,.docx,.pdf" onChange={(event) => event.target.files?.[0] && onSource(event.target.files[0])} />⇧ Importer une source complémentaire</label>
        {sourceName && <span className="self-center text-xs text-slate-500">Source ajoutée : {sourceName}</span>}
        <button className="rounded-xl bg-[#36a445] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#36a445]/20" onClick={onGenerate} type="button">Générer la Cotation Finale</button>
      </div>
      {manualOpen && <form className="grid gap-3 rounded-2xl border border-[#36a445]/30 bg-green-50/50 p-5 sm:grid-cols-4" onSubmit={onManualSubmit}><input className="rounded-lg border border-slate-200 p-3 text-sm" name="description" placeholder="Description" required /><input className="rounded-lg border border-slate-200 p-3 text-sm" name="unit" placeholder="Unité" required /><input className="rounded-lg border border-slate-200 p-3 text-sm" name="quantity" type="number" min="1" placeholder="Quantité" required /><input className="rounded-lg border border-slate-200 p-3 text-sm" name="unitPrice" type="number" min="0" placeholder="Prix unitaire" required /><button className="rounded-lg bg-[#22439c] p-3 text-sm font-bold text-white sm:col-span-4" type="submit">Ajouter le produit</button></form>}
    </div>
  )
}

function QuotationTable({ rows, selectedRows, setSelectedRows }: { rows: QuoteRow[]; selectedRows: number[]; setSelectedRows: (rows: number[]) => void }) { return <table className="w-full min-w-[900px] border-collapse text-left text-xs"><thead><tr>{['N°', 'CODE', 'DESCRIPTION', 'UNIT', 'QUANTITY', 'PRICE UNIT', 'TOTAL AMOUNT', 'REMARKS'].map((heading) => <th className="border border-slate-300 bg-slate-50 p-3 font-bold uppercase text-slate-500" key={heading}>{heading}</th>)}</tr></thead><tbody>{rows.map((row) => <tr className="hover:bg-slate-50" key={row.number}><td className="border border-slate-200 p-3"><input className="mr-2 accent-[#36a445]" type="checkbox" checked={selectedRows.includes(row.number)} onChange={() => setSelectedRows(selectedRows.includes(row.number) ? selectedRows.filter((number) => number !== row.number) : [...selectedRows, row.number])} />{row.number}</td><td className="border border-slate-200 p-3">{row.code}</td><td className="border border-slate-200 p-3 font-medium">{row.description}</td><td className="border border-slate-200 p-3">{row.unit}</td><td className="border border-slate-200 p-3">{row.quantity}</td><td className="border border-slate-200 p-3">{row.unitPrice.toFixed(2)}</td><td className="border border-slate-200 p-3">{(row.quantity * row.unitPrice).toFixed(2)}</td><td className="border border-slate-200 p-3">{row.remarks || '—'}</td></tr>)}</tbody></table> }

function FinalQuotation({ rows, subtotal, margin, marginMode, setMargin, setMarginMode, discount, setDiscount, delivery, setDelivery, marginAmount, netTotal, validated, onValidate, emailOpen, setEmailOpen, onDownload }: { rows: QuoteRow[]; subtotal: number; margin: number; marginMode: 'individual' | 'global'; setMargin: (value: number) => void; setMarginMode: (value: 'individual' | 'global') => void; discount: number; setDiscount: (value: number) => void; delivery: number; setDelivery: (value: number) => void; marginAmount: number; netTotal: number; validated: boolean; onValidate: () => void; emailOpen: boolean; setEmailOpen: (open: boolean) => void; onDownload: () => void }) { return <div className="space-y-6"><section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold tracking-widest text-[#36a445]">SUPPLIES AT ABIDJAN · VESSEL CORAL VI</p><h2 className="mt-1 text-xl font-bold text-[#22439c]">Cotation finale</h2></div><span className="rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700">{validated ? 'Cotation validée' : 'Brouillon à valider'}</span></div><QuotationTable rows={rows} selectedRows={rows.map((row) => row.number)} setSelectedRows={() => undefined} /></section><div className="grid gap-6 xl:grid-cols-[1fr_360px]"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-700">Calculateur de Marges et Remises</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-600">Mode de marge<select className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3" value={marginMode} onChange={(event) => setMarginMode(event.target.value as 'individual' | 'global')}><option value="global">Marge globale</option><option value="individual">Marge individuelle</option></select></label><label className="text-sm font-semibold text-slate-600">Marge (%)<input className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3" type="number" min="0" value={margin} onChange={(event) => setMargin(Number(event.target.value))} /></label><label className="text-sm font-semibold text-slate-600">Discount (%)<input className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3" type="number" min="0" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /></label><label className="text-sm font-semibold text-slate-600">Delivery expenses<input className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3" type="number" min="0" value={delivery} onChange={(event) => setDelivery(Number(event.target.value))} /></label></div></section><section className="rounded-2xl bg-[#111e57] p-5 text-blue-100"><h2 className="font-bold text-[#6be477]">Totaux · EUR / XAF</h2><dl className="mt-5 space-y-4 text-sm"><div className="flex justify-between"><dt>Sous-total</dt><dd>{subtotal.toFixed(2)}</dd></div><div className="flex justify-between"><dt>Marge appliquée ({margin}%)</dt><dd>{marginAmount.toFixed(2)}</dd></div><div className="flex justify-between"><dt>Remise / Discount ({discount}%)</dt><dd>-{((subtotal + marginAmount) * discount / 100).toFixed(2)}</dd></div><div className="flex justify-between"><dt>Frais de livraison</dt><dd>{delivery.toFixed(2)}</dd></div><div className="border-t border-white/20 pt-4 flex justify-between font-bold text-[#6be477]"><dt>Total Net Final</dt><dd>{netTotal.toFixed(2)}</dd></div></dl></section></div>{validated ? <FinalActions onEmail={() => setEmailOpen(true)} onDownload={onDownload} /> : <button className="w-full rounded-xl bg-[#36a445] py-4 text-sm font-bold text-white shadow-lg shadow-[#36a445]/20" onClick={onValidate} type="button">Valider la cotation</button>}{emailOpen && <EmailModal onClose={() => setEmailOpen(false)} />}</div> }

function FinalActions({ onEmail, onDownload: _onDownload }: { onEmail: () => void; onDownload?: () => void }) { return <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-5"><span className="mr-auto text-sm font-bold text-green-800">Cotation figée et prête à être livrée</span>{['Télécharger PDF', 'Télécharger Excel', 'Télécharger Word', 'Imprimer la fiche'].map((label) => <button className="rounded-lg border border-green-200 bg-white px-4 py-2 text-xs font-bold text-[#22439c]" onClick={() => { void _onDownload; console.log(label) }} type="button" key={label}>{label}</button>)}<button className="rounded-lg bg-[#36a445] px-4 py-2 text-xs font-bold text-white" onClick={onEmail} type="button">Envoyer par e-mail au client</button></section> }
function EmailModal({ onClose }: { onClose: () => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5"><form className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onSubmit={(event) => { event.preventDefault(); console.log('Notification client envoyée'); onClose() }}><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#22439c]">Envoyer la cotation au client</h2><button className="text-slate-400" onClick={onClose} type="button">×</button></div><label className="mt-5 block text-xs font-bold text-slate-600">Adresse du client<input className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3" type="email" defaultValue="client@example.com" required /></label><label className="mt-4 block text-xs font-bold text-slate-600">Objet<input className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3" defaultValue="Votre cotation finale - MV Coral VI" required /></label><label className="mt-4 block text-xs font-bold text-slate-600">Message<textarea className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 p-3" defaultValue="Bonjour, veuillez trouver ci-joint votre cotation finale." /></label><div className="mt-5 flex justify-end gap-3"><button className="rounded-lg border border-slate-200 px-4 py-2 text-sm" onClick={onClose} type="button">Annuler</button><button className="rounded-lg bg-[#36a445] px-4 py-2 text-sm font-bold text-white" type="submit">Confirmer l'envoi</button></div></form></div> }
type RfqHistoryRow = { reference: string; client: string; date: string; status: 'En cours' | 'En attente de validation' | 'Terminé' }
const rfqHistoryRows: RfqHistoryRow[] = [
  { reference: 'RFQ-2026-00452', client: 'GloBeCo Ship Supply', date: '22/09/2026', status: 'En cours' },
  { reference: 'RFQ-2026-00448', client: 'Abidjan Marine Services', date: '21/09/2026', status: 'En cours' },
  { reference: 'RFQ-2026-00441', client: 'GloBeCo Ship Supply', date: '19/09/2026', status: 'Terminé' },
  { reference: 'RFQ-2026-00437', client: 'Douala Port Logistics', date: '18/09/2026', status: 'Terminé' },
]

function RfqHistory({ language, onFinalize }: { language: Language; onFinalize: () => void }) {
  const [rows, setRows] = useState<RfqHistoryRow[]>(rfqHistoryRows)
  const [openDownload, setOpenDownload] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isFrench = language === 'FR'

  const handleSupplierImport = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const acceptedExtensions = ['.xlsx', '.xls', '.pdf', '.docx']
    const fileName = selectedFile.name.toLowerCase()
    const isSupportedFile = acceptedExtensions.some((extension) => fileName.endsWith(extension))

    if (!isSupportedFile) {
      window.alert(isFrench ? 'Format non pris en charge. Sélectionnez un fichier Excel, PDF ou Word.' : 'Unsupported format. Please select an Excel, PDF or Word file.')
      event.target.value = ''
      return
    }

    const now = new Date()
    const importedReference = `RFQ-IMPORT-${now.getTime()}`
    const importedRow: RfqHistoryRow = {
      reference: importedReference,
      client: selectedFile.name.replace(/\.[^/.]+$/, '') || 'Fournisseur importé',
      date: now.toLocaleDateString('fr-FR'),
      status: 'En attente de validation',
    }

    setRows((currentRows) => [
      importedRow,
      ...currentRows.map((row) => (row.status === 'En cours' ? { ...row, status: 'En attente de validation' as const } : row)),
    ])
    event.target.value = ''
  }

  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-bold text-slate-700">{isFrench ? 'Consulter l’historique des RFQ' : 'View RFQ History'}</h2>
          <p className="mt-1 text-xs text-slate-400">{isFrench ? 'Suivez les demandes en cours et téléchargez les cotations terminées.' : 'Track ongoing requests and download completed quotations.'}</p>
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#36a445] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#36a445]/25 transition hover:bg-[#2e8b3a]"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          {isFrench ? 'Importer un fichier fournisseur' : 'Import supplier file'}
        </button>
        <input ref={fileInputRef} accept=".xlsx,.xls,.pdf,.docx" className="hidden" onChange={handleSupplierImport} type="file" />
      </div>

      <table className="w-full min-w-[760px] border-collapse text-left text-xs">
        <thead>
          <tr>
            {(isFrench ? ['RÉFÉRENCE', 'CLIENT', 'DATE', 'ÉTAT', 'ACTIONS'] : ['REFERENCE', 'CLIENT', 'DATE', 'STATUS', 'ACTIONS']).map((heading) => <th className="border border-slate-300 bg-slate-50 p-3 font-bold text-slate-500" key={heading}>{heading}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="transition hover:bg-slate-50" key={row.reference}>
              <td className="border border-slate-200 p-3 font-semibold text-[#22439c]">{row.reference}</td>
              <td className="border border-slate-200 p-3">{row.client}</td>
              <td className="border border-slate-200 p-3">{row.date}</td>
              <td className="border border-slate-200 p-3">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${row.status === 'En attente de validation' ? 'bg-orange-50 text-orange-600' : row.status === 'En cours' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                  {isFrench ? row.status : row.status === 'En cours' ? 'In progress' : row.status === 'En attente de validation' ? 'Awaiting validation' : 'Completed'}
                </span>
              </td>
              <td className="relative border border-slate-200 p-3">
                {row.status === 'En cours' || row.status === 'En attente de validation' ? (
                  <button className="rounded-lg bg-[#36a445] px-3 py-2 text-[11px] font-bold text-white hover:bg-[#2e8b3a]" onClick={onFinalize} type="button">
                    {row.status === 'En attente de validation' ? (isFrench ? 'Continuer' : 'Continue') : (isFrench ? 'Finaliser la demande' : 'Finalize Request')}
                  </button>
                ) : (
                  <div className="relative inline-block">
                    <button className="rounded-lg border border-[#cbd8f4] bg-white px-3 py-2 text-[11px] font-bold text-[#22439c]" onClick={() => setOpenDownload(openDownload === row.reference ? null : row.reference)} type="button">⇩ {isFrench ? 'Télécharger' : 'Download'} ▾</button>
                    {openDownload === row.reference && <div className="absolute right-0 z-10 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"><button className="block w-full rounded-lg px-2 py-2 text-left text-[11px] text-slate-600 hover:bg-slate-50" type="button">PDF</button><button className="block w-full rounded-lg px-2 py-2 text-left text-[11px] text-slate-600 hover:bg-slate-50" type="button">Excel</button><button className="block w-full rounded-lg px-2 py-2 text-left text-[11px] text-slate-600 hover:bg-slate-50" type="button">Word</button></div>}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export function LegacyRfqHistory({ language, onFinalize }: { language: Language; onFinalize: () => void }) {
  const [openDownload, setOpenDownload] = useState<string | null>(null)
  const isFrench = language === 'FR'
  return <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5"><h2 className="font-bold text-slate-700">{isFrench ? 'Consulter l’historique des RFQ' : 'View RFQ History'}</h2><p className="mt-1 text-xs text-slate-400">{isFrench ? 'Suivez les demandes en cours et téléchargez les cotations terminées.' : 'Track ongoing requests and download completed quotations.'}</p></div><table className="w-full min-w-[760px] border-collapse text-left text-xs"><thead><tr>{(isFrench ? ['RÉFÉRENCE', 'CLIENT', 'DATE', 'ÉTAT', 'ACTIONS'] : ['REFERENCE', 'CLIENT', 'DATE', 'STATUS', 'ACTIONS']).map((heading) => <th className="border border-slate-300 bg-slate-50 p-3 font-bold text-slate-500" key={heading}>{heading}</th>)}</tr></thead><tbody>{rfqHistoryRows.map((row) => <tr className="transition hover:bg-slate-50" key={row.reference}><td className="border border-slate-200 p-3 font-semibold text-[#22439c]">{row.reference}</td><td className="border border-slate-200 p-3">{row.client}</td><td className="border border-slate-200 p-3">{row.date}</td><td className="border border-slate-200 p-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${row.status === 'En cours' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>{isFrench ? row.status : row.status === 'En cours' ? 'In progress' : 'Completed'}</span></td><td className="relative border border-slate-200 p-3">{row.status === 'En cours' ? <button className="rounded-lg bg-[#36a445] px-3 py-2 text-[11px] font-bold text-white" onClick={onFinalize} type="button">{isFrench ? 'Finaliser la demande' : 'Finalize Request'}</button> : <div className="relative inline-block"><button className="rounded-lg border border-[#cbd8f4] bg-white px-3 py-2 text-[11px] font-bold text-[#22439c]" onClick={() => setOpenDownload(openDownload === row.reference ? null : row.reference)} type="button">⇩ {isFrench ? 'Télécharger' : 'Download'} ▾</button>{openDownload === row.reference && <div className="absolute right-0 z-10 mt-2 w-32 rounded-lg border border-slate-200 bg-white p-1 shadow-xl"><button className="block w-full rounded px-3 py-2 text-left text-xs hover:bg-slate-50" type="button">▣ PDF</button><button className="block w-full rounded px-3 py-2 text-left text-xs hover:bg-slate-50" type="button">▤ Excel</button><button className="block w-full rounded px-3 py-2 text-left text-xs hover:bg-slate-50" type="button">▤ Word</button></div>}</div>}</td></tr>)}</tbody></table></section>
}
function ProfilePreview({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) { return <div className="grid gap-6 xl:grid-cols-2"><section className="rounded-2xl bg-[#111e57] p-6 text-white xl:col-span-2"><div className="flex flex-wrap items-center gap-5"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#36a445] text-2xl font-bold">JT</div><div><h2 className="text-2xl font-bold">Jean Tabi</h2><p className="text-sm text-blue-100/70">jean.tabi@mbss-sarl.cm · Service Ventes · Douala, Bonantone</p></div></div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Changer mon mot de passe</h2><div className="space-y-4"><input className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm" type="password" placeholder="Mot de passe actuel" /><input className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm" type="password" placeholder="Nouveau mot de passe" /><button className="h-12 w-full rounded-xl bg-[#36a445] text-sm font-bold text-white" type="button">Mettre à jour le mot de passe</button></div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Préférences d'affichage</h2><div className="grid grid-cols-2 gap-3"><button className={`rounded-xl p-5 text-left text-sm font-bold transition ${theme === 'light' ? 'border-2 border-[#36a445] text-[#22439c]' : 'border border-slate-200 text-slate-400'}`} onClick={() => setTheme('light')} type="button">☀ Mode clair{theme === 'light' && ' · actif'}</button><button className={`rounded-xl p-5 text-left text-sm transition ${theme === 'dark' ? 'border-2 border-[#36a445] bg-slate-900 font-bold text-white' : 'border border-slate-200 text-slate-500'}`} onClick={() => setTheme('dark')} type="button">☾ Mode sombre{theme === 'dark' && ' · actif'}</button></div></section></div> }

type ProductRow = { reference: string; designation: string; supplier: string; price: string }

const initialProducts: ProductRow[] = [
  { reference: 'FLT-MGO-008', designation: 'Filtre MGO 8 microns', supplier: 'Marine Filtration', price: '28 500 XAF' },
  { reference: 'CLN-RAG-010', designation: 'Chiffons coton blanc 10 kg', supplier: 'Douala Textiles', price: '19 200 XAF' },
  { reference: 'PPE-GLV-NL', designation: 'Gants nitrile taille L', supplier: 'SafeWork CM', price: '1 350 XAF' },
]

function ProductsAndPricing({ language }: { language: Language }) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts)
  const [draftFilters, setDraftFilters] = useState({ designation: '', reference: '', supplier: '' })
  const [appliedFilters, setAppliedFilters] = useState(draftFilters)
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [fileFormat, setFileFormat] = useState<'docx' | 'pdf' | 'xlsx' | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isFrench = language === 'FR'

  const filteredProducts = products.filter((product) => {
    const matches = (value: string, filter: string) => value.toLowerCase().includes(filter.trim().toLowerCase())
    return matches(product.designation, appliedFilters.designation) && matches(product.reference, appliedFilters.reference) && matches(product.supplier, appliedFilters.supplier)
  })

  const updateFilter = (key: keyof typeof draftFilters, value: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }))
  }

  const submitFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAppliedFilters(draftFilters)
  }

  const openFilePicker = (format: 'docx' | 'pdf' | 'xlsx') => {
    setFileFormat(format)
    setAddMenuOpen(false)
    window.setTimeout(() => fileInputRef.current?.click(), 0)
  }

  const handleProductFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !fileFormat) return

    const importedProduct: ProductRow = {
      reference: `IMP-${Date.now()}`,
      designation: file.name.replace(/\.[^/.]+$/, '') || 'Article importé',
      supplier: 'Fournisseur importé',
      price: 'À définir',
    }
    setProducts((current) => [importedProduct, ...current])
    setFileFormat(null)
    event.target.value = ''
  }

  const saveManualProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setProducts((current) => [
      {
        reference: String(form.get('reference') || '').trim(),
        designation: String(form.get('designation') || '').trim(),
        supplier: String(form.get('supplier') || '').trim(),
        price: `${String(form.get('price') || '').trim()} XAF`,
      },
      ...current,
    ])
    setManualOpen(false)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-bold text-slate-700">{isFrench ? 'Produits & Prix' : 'Products & Prices'}</h2>
          <p className="mt-1 text-xs text-slate-400">{isFrench ? 'Les articles sont achetés après validation de la commande.' : 'Items are purchased after order validation.'}</p>
        </div>

        <div className="relative">
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#36a445] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#36a445]/25 hover:bg-[#2e8b3a]" onClick={() => setAddMenuOpen((current) => !current)} type="button">
            <Plus className="h-4 w-4" />
            {isFrench ? 'Ajouter un article' : 'Add an article'}
          </button>
          {addMenuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => { setManualOpen(true); setAddMenuOpen(false) }} type="button">
                <FileText className="h-4 w-4 text-[#22439c]" />
                {isFrench ? 'Saisie manuelle' : 'Manual entry'}
              </button>
              <div className="border-t border-slate-100 px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">{isFrench ? 'Par fichier' : 'By file'}</div>
              {([
                ['docx', 'Word (.docx)'],
                ['pdf', 'PDF (.pdf)'],
                ['xlsx', 'Excel (.xlsx)'],
              ] as const).map(([format, label]) => (
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50" key={format} onClick={() => openFilePicker(format)} type="button">
                  <FileSpreadsheet className="h-4 w-4 text-[#36a445]" />
                  {label}
                </button>
              ))}
            </div>
          )}
          <input ref={fileInputRef} accept={fileFormat === 'docx' ? '.docx' : fileFormat === 'pdf' ? '.pdf' : '.xlsx'} className="hidden" onChange={handleProductFile} type="file" />
        </div>
      </div>

      <form className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:grid-cols-[1.2fr_1fr_1.2fr_auto]" onSubmit={submitFilters}>
        {([
          ['designation', isFrench ? 'Nom de l’article' : 'Article name'],
          ['reference', isFrench ? 'Référence' : 'Reference'],
          ['supplier', isFrench ? 'Fournisseur' : 'Supplier'],
        ] as const).map(([key, placeholder]) => (
          <label className="relative block" key={key}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#36a445] focus:ring-4 focus:ring-[#36a445]/10" value={draftFilters[key]} onChange={(event) => updateFilter(key, event.target.value)} placeholder={placeholder} />
          </label>
        ))}
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#36a445] px-5 text-sm font-bold text-white hover:bg-[#2e8b3a]" type="submit">
          <Search className="h-4 w-4" />
          {isFrench ? 'Rechercher' : 'Search'}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead><tr>{(isFrench ? ['RÉFÉRENCE', 'DÉSIGNATION', 'FOURNISSEUR', 'PRIX'] : ['REFERENCE', 'DESCRIPTION', 'SUPPLIER', 'PRICE']).map((heading) => <th className="border border-slate-300 bg-slate-50 p-3 font-bold text-slate-500" key={heading}>{heading}</th>)}</tr></thead>
          <tbody>
            {filteredProducts.map((product) => <tr className="transition hover:bg-slate-50" key={product.reference}><td className="border border-slate-200 p-4 font-semibold text-[#22439c]">{product.reference}</td><td className="border border-slate-200 p-4">{product.designation}</td><td className="border border-slate-200 p-4">{product.supplier}</td><td className="border border-slate-200 p-4 font-semibold text-slate-700">{product.price}</td></tr>)}
            {filteredProducts.length === 0 && <tr><td className="border border-slate-200 p-6 text-center text-sm text-slate-400" colSpan={4}>{isFrench ? 'Aucun article trouvé.' : 'No item found.'}</td></tr>}
          </tbody>
        </table>
      </div>

      {manualOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5"><form className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onSubmit={saveManualProduct}><div className="flex items-center justify-between"><h3 className="text-lg font-bold text-[#22439c]">{isFrench ? 'Ajouter un article' : 'Add an article'}</h3><button className="text-xl text-slate-400" onClick={() => setManualOpen(false)} type="button">×</button></div><div className="mt-5 grid gap-3"><input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" name="reference" placeholder={isFrench ? 'Référence' : 'Reference'} required /><input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" name="designation" placeholder={isFrench ? 'Désignation' : 'Description'} required /><input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" name="supplier" placeholder={isFrench ? 'Fournisseur' : 'Supplier'} required /><input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" name="price" min="0" placeholder={isFrench ? 'Prix en XAF' : 'Price in XAF'} required type="number" /></div><button className="mt-5 w-full rounded-xl bg-[#36a445] py-3 text-sm font-bold text-white hover:bg-[#2e8b3a]" type="submit">{isFrench ? 'Enregistrer' : 'Save'}</button></form></div>}
    </section>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) { return <table className="w-full min-w-[650px] border-collapse text-left text-xs"><thead><tr>{headers.map((header) => <th className="border border-slate-300 bg-slate-50 p-3 font-bold uppercase text-slate-500" key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row) => <tr className="transition hover:bg-slate-50" key={row[0]}>{row.map((cell, index) => <td className="border border-slate-200 p-3" key={`${row[0]}-${cell}`}>{index === row.length - 1 ? <StatusBadge value={cell} /> : cell}</td>)}</tr>)}</tbody></table> }
function StatusBadge({ value }: { value: string }) {
  const style = value.includes('envoyé') || value.includes('stock') ? 'bg-green-50 text-green-700' : value.includes('traitement') || value.includes('cours') ? 'bg-blue-50 text-[#22439c]' : value.includes('vérifier') || value.includes('Faible') ? 'bg-amber-50 text-amber-700' : value.includes('trouvé') ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${style}`}>{value}</span>
}
