package cz.zcu.fav.kiv.dobripet;

/**
 * Created by Petr on 3/6/2017.
 */

import io.github.bonigarcia.wdm.ChromeDriverManager;
import io.github.bonigarcia.wdm.FirefoxDriverManager;
import io.github.bonigarcia.wdm.InternetExplorerDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.testng.annotations.*;
import java.util.concurrent.TimeUnit;

public class CrossBrowserTest {
    WebDriver driver;

    @BeforeSuite
    public void setupClass() {
        ChromeDriverManager.getInstance().setup();
        InternetExplorerDriverManager.getInstance().setup();
        FirefoxDriverManager.getInstance().setup();
    }

    @BeforeTest
    @Parameters("browser")
    public void setup(String browser) throws Exception {
        switch (browser) {
            case "Firefox": {
                driver = new FirefoxDriver();
            }
            break;
            case "Chrome": {
                driver = new ChromeDriver();
            }
            break;
            case "IE": {
                driver = new InternetExplorerDriver();
            }
            break;
            default:
                throw new Exception("Incorrect browser definition in CrossBrowserTestSuite!");
        }
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
    }
    @Test
    public void testParameterWithXML () throws InterruptedException {
        driver.get("http://localhost:8080/reporting/home/");

    }

    @AfterTest
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

}