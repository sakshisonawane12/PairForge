package com.pairforge.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/execute")
public class ExecutionController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> execute(
            @RequestBody Map<String, String> request) {

        String code = request.get("code");
        String language = request.getOrDefault("language", "javascript");
        Map<String, Object> result = new HashMap<>();

        try {
            Path tempDir = Files.createTempDirectory("pairforge_exec_");

            String output = "";
            String error = "";

            if (language.equals("javascript")) {
                Path file = tempDir.resolve("solution.js");
                Files.writeString(file, code);
                ProcessResult pr = runProcess(
                        List.of("node", file.toString()), tempDir);
                output = pr.stdout;
                error = pr.stderr;

            } else if (language.equals("python")) {
                Path file = tempDir.resolve("solution.py");
                Files.writeString(file, code);
                ProcessResult pr = runProcess(
                        List.of("python", file.toString()), tempDir);
                output = pr.stdout;
                error = pr.stderr;

            } else if (language.equals("java")) {
                Path file = tempDir.resolve("Solution.java");
                Files.writeString(file, code);
                ProcessResult compile = runProcess(
                        List.of("javac", file.toString()), tempDir);
                if (compile.stderr.isEmpty()) {
                    ProcessResult pr = runProcess(
                            List.of("java", "-cp",
                                    tempDir.toString(), "Solution"), tempDir);
                    output = pr.stdout;
                    error = pr.stderr;
                } else {
                    error = compile.stderr;
                }

            } else if (language.equals("typescript")) {
                Path file = tempDir.resolve("solution.ts");
                Files.writeString(file, code);
                ProcessResult pr = runProcess(
                        List.of("npx", "ts-node", file.toString()), tempDir);
                output = pr.stdout;
                error = pr.stderr;

            } else {
                error = language + " execution not supported locally yet.";
            }

            result.put("stdout", output);
            result.put("stderr", error);
            result.put("status", error.isEmpty() ? "Accepted" : "Error");
            deleteDirectory(tempDir.toFile());

        } catch (Exception e) {
            result.put("stderr", "Execution failed: " + e.getMessage());
            result.put("status", "Error");
        }

        return ResponseEntity.ok(result);
    }

    private ProcessResult runProcess(List<String> command, Path workDir)
            throws Exception {
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.directory(workDir.toFile());
        Process process = pb.start();

        StringBuilder stdout = new StringBuilder();
        StringBuilder stderr = new StringBuilder();

        Thread outThread = new Thread(() -> {
            try (BufferedReader r = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = r.readLine()) != null)
                    stdout.append(line).append("\n");
            } catch (IOException ignored) {}
        });

        Thread errThread = new Thread(() -> {
            try (BufferedReader r = new BufferedReader(
                    new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = r.readLine()) != null)
                    stderr.append(line).append("\n");
            } catch (IOException ignored) {}
        });

        outThread.start();
        errThread.start();
        boolean finished = process.waitFor(10, TimeUnit.SECONDS);
        outThread.join();
        errThread.join();

        if (!finished) {
            process.destroyForcibly();
            return new ProcessResult("", "Execution timed out (10s limit)");
        }

        return new ProcessResult(stdout.toString(), stderr.toString());
    }

    private void deleteDirectory(File dir) {
        if (dir.isDirectory())
            for (File f : Objects.requireNonNull(dir.listFiles()))
                deleteDirectory(f);
        dir.delete();
    }

    record ProcessResult(String stdout, String stderr) {}
}