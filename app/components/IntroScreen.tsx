import { ScreenShell } from './ScreenShell';

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <ScreenShell
      screenId={0}
      ambientIcons={['✨', '🎈', '💌']}
      eyebrow="Un biglietto un po' speciale"
      title={<>Ciao Frullino, ✨</>}
      lead="Ho preparato per te un piccolo biglietto di auguri interattivo il quale ti porterà alla scoperta del tuo regalo di compleanno. Scusami del ritardo con il quale tale sorpresa sta arrivando, ma proprio approfittando di quel ritardo ho avuto questa idea, che mi sembrava più interessante e interattiva."
    >
      <div className="card intro-card">
        <p className="tight-p">
          Dieci pezzi da raccogliere in questa cassetta degli attrezzi lungo il percorso: nove li conquisti
          giocando, l&apos;ultimo arriva da solo quando avrai finito. A cosa serviranno? Lo scoprirai solo alla
          fine.
        </p>
        <div className="row">
          <button className="btn" onClick={onStart}>
            Si comincia!
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}
