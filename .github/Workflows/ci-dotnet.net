using System;
using System.Diagnostics;

class Program
{
    // Function to execute shell commands
    static void RunCommand(string command, Action callback)
    {
        try
        {
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/C {command}",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            process.Start();

            string stdout = process.StandardOutput.ReadToEnd();
            string stderr = process.StandardError.ReadToEnd();

            process.WaitForExit();

            if (!string.IsNullOrEmpty(stderr))
            {
                Console.Error.WriteLine($"stderr: {stderr}");
            }

            if (!string.IsNullOrEmpty(stdout))
            {
                Console.WriteLine($"stdout: {stdout}");
            }

            callback?.Invoke();
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error: {ex.Message}");
        }
    }

    // Build job
    static void BuildJob()
    {
        Console.WriteLine("Running Build Job...");
        RunCommand("bazel build //dotnet:all", () =>
        {
            Console.WriteLine("Build Job Completed.");
        });
    }

    // Integration Tests job
    static void IntegrationTestsJob()
    {
        Console.WriteLine("Running Integration Tests Job...");
        RunCommand("fsutil 8dot3name set 0", () =>
        {
            RunCommand("bazel test //dotnet/test/common:ElementFindingTest-firefox //dotnet/test/common:ElementFindingTest-chrome --pin_browsers=true", () =>
            {
                Console.WriteLine("Integration Tests Job Completed.");
            });
        });
    }

    // Main function to run the jobs
    static void Main(string[] args)
    {
        Console.WriteLine("Starting CI Jobs...");
        BuildJob();
        IntegrationTestsJob();
    }
}
