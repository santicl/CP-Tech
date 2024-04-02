import '../../Components/NavBar/navbar.style.css';
import ImageBrand from '../../img/cleaner-program.png';

function NavBar() {
    return (
        <nav>
            <div className="C-Navbar">
                <img src={ImageBrand} />
            </div>
        </nav>
    )
}

export default NavBar;