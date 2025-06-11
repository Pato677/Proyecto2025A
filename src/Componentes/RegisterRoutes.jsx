
import RoutesPanel from './RutasPanel';
import Header from './Header';
import Footer from './Footer';
import Button from './Button';
import './Estilos/styles.css'

const RegisterRoutes = () => {
    return (
        <div className="app-container">
            {/* Usamos HeaderAdmin, que es el que realmente estilizamos */}
            <Header
                showSearch={false}
                showLanguage={true}
                showUser={true} // 👈 en vez de navigate
                userLabel="Administrador"
            />
            <RoutesPanel />
            <div className="button-group">
                <Button text="ATRÁS" />
            </div>

            <Footer />
        </div>
    );
};

export default RegisterRoutes;