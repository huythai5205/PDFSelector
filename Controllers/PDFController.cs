using Microsoft.AspNetCore.Mvc;

namespace PDFSelector.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PDFController : Controller
    {
        [HttpPost]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public IActionResult Post(string filePath, [FromBody] int[] pages)
        {
            //string filePath = @"C:\Users\kenny\Downloads\review.txt";
            string fileName = filePath + "\\review.txt";
            string text = string.Join("\n", pages);
            // Create a new instance of StreamWriter and specify the file path
            using (StreamWriter writer = new(fileName))
            {
                // Write the text to the file
                writer.Write(text);
            }
            return new OkResult();
        }

        [HttpGet("getPDFs")]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public List<string> GetPDFs()
        {
            string directory = @"C:\Users\kenny\Sync\Testing-Huy\";
            var files = Directory.GetFiles(directory, "*.*", SearchOption.AllDirectories).ToList(); ;

            return files;
        }

        [HttpGet("getPDF")]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public IActionResult GetPDF(string folderPath, string fileName)
        {
            //folderPath = "C:\\Users\\kenny\\Sync\\Testing-Huy\\folder 1";
            folderPath = folderPath + "\\" + fileName;
            fileName = "Redacted File for Huy (HIPAA).pdf";
            var stream = new FileStream(folderPath, FileMode.Open);
            return new FileStreamResult(stream, "application/pdf");
        }
    }
}
