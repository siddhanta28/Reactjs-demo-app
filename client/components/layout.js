import Navbar from './navbar';
import Footer from './footer';
import styles from '../styles/Layout.module.css';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer className={styles.footer} />
    </>
  )
}
export default Layout;