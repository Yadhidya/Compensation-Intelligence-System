-- CreateTable
CREATE TABLE "salaries" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "company_display" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "experience_years" DOUBLE PRECISION NOT NULL,
    "base_salary" DOUBLE PRECISION NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_compensation" DOUBLE PRECISION NOT NULL,
    "confidence_score" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "salaries_company_idx" ON "salaries"("company");

-- CreateIndex
CREATE INDEX "salaries_role_idx" ON "salaries"("role");

-- CreateIndex
CREATE INDEX "salaries_location_idx" ON "salaries"("location");

-- CreateIndex
CREATE INDEX "salaries_total_compensation_idx" ON "salaries"("total_compensation");
