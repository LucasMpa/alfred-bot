from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from tqdm import tqdm

def search(playlist):
    chrome_options = Options()
    chrome_options.add_argument("--headless")  
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")

    chrome_service = Service(ChromeDriverManager().install())
    browser = webdriver.Chrome(service=chrome_service, options=chrome_options)

    playlist_links = []

    for song in tqdm(playlist, desc="Processando músicas", unit="música"):
        try:
            browser.get("https://www.youtube.com")
            
            search_box = WebDriverWait(browser, 10).until(
                EC.presence_of_element_located((By.NAME, "search_query"))
            )
            search_box.clear() 
            search_box.send_keys(song)
            search_box.submit()
            
            WebDriverWait(browser, 10).until(
                EC.presence_of_element_located((By.XPATH, '//a[@id="video-title"][@href]'))
            )

            video_url = None
            for el in browser.find_elements(By.XPATH, '//a[@id="video-title"][@href]'):
                href = el.get_attribute("href")
                if href and "watch?v=" in href:
                    video_url = href.split("&")[0]
                    break

            if video_url:
                playlist_links.append(video_url)
            else:
                print(f"\nNenhum vídeo encontrado para '{song}'")
                continue
        except Exception as e:
            print(f"\nErro ao processar a música '{song}': {e}")
            continue 

    browser.quit()
    return playlist_links