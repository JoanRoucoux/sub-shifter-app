import Header from './components/Header';
import SRTShifterForm from './components/SRTShifterForm';

const App = () => (
  <div className="container mx-auto p-8">
    <Header />
    <div className="flex flex-col lg:flex-row gap-8">
      <SRTShifterForm />
    </div>
  </div>
);

export default App;
