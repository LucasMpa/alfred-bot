from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from tqdm import tqdm  # Importa a biblioteca tqdm

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
            
            links_found = WebDriverWait(browser, 10).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="video-title"]'))
            )
            video_url = links_found.get_attribute("href")
            
            has_split = video_url.split("&")[0]
            if has_split:
                playlist_links.append(has_split)
            else:
                playlist_links.append(video_url)
        except Exception as e:
            print(f"\nErro ao processar a música '{song}': {e}")
            continue 

    browser.quit()
    return playlist_links