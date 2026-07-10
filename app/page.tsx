import Header from "@/components/layout/Header";
import SourceBar from "@/components/layout/SourceBar";
import VisualStage from "@/features/visual/renderer/VisualStage";
import ModeSwitch from "@/components/layout/ModeSwitch";
import AnalyzerPanel from "@/features/fft/AnalyzerPanel";
import SolfeggioRow from "@/features/solfeggio/SolfeggioRow";
import VolumeSlider from "@/components/layout/VolumeSlider";
import BottomNav from "@/components/layout/BottomNav";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col lg:max-w-5xl">
      <Header />
      <SourceBar />
      <main className="flex-1">
        <VisualStage />
        <ModeSwitch />
        <AnalyzerPanel />
        <SolfeggioRow />
        <VolumeSlider />
      </main>
      <BottomNav />
    </div>
  );
}
